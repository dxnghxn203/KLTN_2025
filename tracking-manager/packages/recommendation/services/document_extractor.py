import os
import tempfile
import re
import json
import base64
from typing import Dict, Any, List, Optional, Union
from fastapi import UploadFile, HTTPException
from pathlib import Path
from PIL import Image
import io

from core.llm_config import llm
from core import logger
from services.ocr_processor import extract_text_from_image, detect_layout_type, is_tesseract_available
from models.document import (
    PrescriptionProduct,
    InvoiceProduct,
    DocumentExtractionRequest,
    DocumentExtractionResponse,
    save_document
)

from langchain_core.messages import HumanMessage, SystemMessage


def encode_file_to_base64(file_path: Union[str, Path]) -> str:
    """
    Mã hóa file (PDF hoặc hình ảnh) sang base64 để gửi tới LLM
    """
    try:
        with open(file_path, "rb") as file:
            return base64.b64encode(file.read()).decode('utf-8')
    except Exception as e:
        logger.error(f"Error encoding file to base64: {str(e)}")
        raise


def encode_image_to_base64(image_path: Union[str, Path]) -> str:
    """
    Mã hóa hình ảnh sang base64 để gửi tới LLM.
    Tự động chuyển đổi sang định dạng JPEG để đảm bảo tương thích.
    """
    try:
        # Mở và chuyển đổi hình ảnh sang JPEG
        with Image.open(image_path) as img:
            # Chuyển đổi sang RGB nếu có kênh alpha (RGBA, LA,...)
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                # Tạo nền trắng và đặt hình ảnh lên trên
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    background.paste(img, mask=img.convert('RGBA').getchannel('A'))
                else:
                    background.paste(img, mask=img.getchannel('A'))
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            # Lưu vào buffer
            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=95)
            buffer.seek(0)

            # Mã hóa base64
            return base64.b64encode(buffer.getvalue()).decode('utf-8')
    except Exception as e:
        logger.error(f"Error converting image to JPEG: {str(e)}")
        # Nếu lỗi, thử đọc file trực tiếp
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')


def extract_json_from_response(response_text: str, document_type: str) -> Dict[str, Any]:
    """Trích xuất thông tin sản phẩm từ phản hồi LLM dù ở định dạng nào"""
    # Trường hợp 1: Phản hồi là JSON thuần túy
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        pass

    # Trường hợp 2: JSON bọc trong code block markdown
    json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
    match = re.search(json_pattern, response_text)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            pass

    # Trường hợp 3: Phân tích văn bản dạng markdown với các thuộc tính được định dạng đậm
    products = []
    current_product = None
    lines = response_text.strip().split('\n')

    # Mẫu để nhận diện dòng thuộc tính (bắt đầu bằng ** hoặc chứa ":")
    property_pattern = re.compile(r'^\s*\*\*([^:]+)\*\*:\s*(.+)$|^[^:]+:\s*(.+)$')

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Kiểm tra xem dòng có phải là thuộc tính không
        prop_match = property_pattern.match(line)

        if prop_match:
            # Đây là dòng thuộc tính
            if not current_product:
                continue  # Bỏ qua nếu chưa có sản phẩm hiện tại

            # Lấy tên thuộc tính và giá trị
            if prop_match.group(1):  # Định dạng **Thuộc tính**: Giá trị
                prop_name = prop_match.group(1).lower().strip()
                prop_value = prop_match.group(2).strip()
            else:  # Định dạng Thuộc tính: Giá trị
                prop_parts = line.split(':', 1)
                prop_name = prop_parts[0].lower().strip()
                prop_value = prop_parts[1].strip() if len(prop_parts) > 1 else ""

            # Gán giá trị cho thuộc tính tương ứng
            if "liều" in prop_name or "hàm lượng" in prop_name:
                current_product["dosage"] = prop_value
            elif "số lượng" in prop_name or "lượng" in prop_name:
                current_product["quantity"] = prop_value
            elif "hướng dẫn" in prop_name or "cách dùng" in prop_name or "sử dụng" in prop_name:
                current_product["usage_instruction"] = prop_value
            elif "đơn giá" in prop_name or "giá" in prop_name:
                current_product["unit_price"] = prop_value
            elif "thành tiền" in prop_name or "tổng" in prop_name:
                current_product["total_price"] = prop_value

        # Nếu dòng không phải là thuộc tính và không bắt đầu bằng ký tự đặc biệt,
        # coi là sản phẩm mới
        elif not line.startswith(('*', '-', '+', '#')) or line.startswith(('* ', '- ', '+ ')):
            # Lưu sản phẩm hiện tại nếu có
            if current_product and current_product.get('product_name'):
                products.append(current_product)

            # Bắt đầu sản phẩm mới
            if line.startswith(('* ', '- ', '+ ')):
                line = line[2:].strip()  # Loại bỏ dấu đầu dòng

            # Tạo đối tượng sản phẩm mới dựa vào loại tài liệu
            if document_type == "prescription":
                current_product = {
                    "product_name": line,
                    "dosage": None,
                    "quantity": None,
                    "usage_instruction": None
                }
            else:  # invoice
                current_product = {
                    "product_name": line,
                    "quantity": None,
                    "unit_price": None,
                    "total_price": None
                }

    # Thêm sản phẩm cuối cùng nếu có
    if current_product and current_product.get('product_name'):
        products.append(current_product)

    # Trả về dict chứa danh sách sản phẩm
    return {
        "document_type": document_type,
        "raw_text": "",
        "products": products
    }


async def extract_with_llm(file_path: Path, document_type: str, file_type: str, ocr_text: Optional[str] = None) -> Dict[
    str, Any]:
    """
    Trích xuất thông tin từ file (PDF hoặc hình ảnh) bằng LLM (GPT-4).

    Args:
        file_path: Đường dẫn đến file
        document_type: Loại tài liệu ("prescription" hoặc "invoice")
        file_type: Loại file ("pdf" hoặc "image")
        ocr_text: Văn bản OCR (chỉ cần thiết cho hình ảnh)
    """
    # Mã hóa file sang base64
    base64_content = encode_file_to_base64(file_path)

    # Xây dựng system prompt dựa trên loại tài liệu
    if document_type == "prescription":
        system_prompt = """
        Bạn là trợ lý trích xuất thông tin từ đơn thuốc. Hãy phân tích tài liệu đơn thuốc và trích xuất các thông tin sau cho mỗi thuốc:
        1. Tên thuốc
        2. Liều lượng (nếu có)
        3. Số lượng (nếu có)
        4. Hướng dẫn sử dụng (nếu có)

        Hãy liệt kê mỗi sản phẩm rõ ràng, theo định dạng sau:
        Tên thuốc 1
        Liều lượng: ...
        Số lượng: ...
        Hướng dẫn sử dụng: ...

        Tên thuốc 2
        Liều lượng: ...
        Số lượng: ...
        Hướng dẫn sử dụng: ...
        """
    else:  # invoice
        system_prompt = """
        Bạn là trợ lý trích xuất thông tin từ hóa đơn thuốc. Hãy phân tích tài liệu hóa đơn và trích xuất các thông tin sau cho mỗi sản phẩm:
        1. Tên sản phẩm
        2. Số lượng (nếu có)
        3. Đơn giá (nếu có)
        4. Thành tiền (nếu có)

        Hãy liệt kê mỗi sản phẩm rõ ràng, theo định dạng sau:
        Tên sản phẩm 1
        Số lượng: ...
        Đơn giá: ...
        Thành tiền: ...

        Tên sản phẩm 2
        Số lượng: ...
        Đơn giá: ...
        Thành tiền: ...
        """

    # Xây dựng user prompt
    user_content = [
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:application/{file_type};base64,{base64_content}"
            }
        }
    ]

    # Thêm OCR text vào prompt nếu có
    if ocr_text:
        user_content.append({
            "type": "text",
            "text": f"Đây là văn bản OCR đã trích xuất (có thể không chính xác):\n\n{ocr_text}\n\nHãy phân tích thông tin sản phẩm từ tài liệu."
        })
    else:
        user_content.append({
            "type": "text",
            "text": "Hãy phân tích tài liệu và trích xuất danh sách sản phẩm."
        })

    # Tạo messages
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_content)
    ]

    try:
        # Gọi LLM
        logger.info(f"Calling LLM with {document_type} document ({file_type})...")
        response = await llm.ainvoke(messages)
        content = response.content
        logger.debug(f"LLM response: {content[:200]}...")  # Log phản hồi (chỉ 200 ký tự đầu)

        # Xử lý phản hồi từ LLM để lấy thông tin sản phẩm
        extracted_data = extract_json_from_response(content, document_type)

        # Chuyển đổi dữ liệu theo loại tài liệu
        products = []
        if document_type == "prescription":
            for item in extracted_data.get("products", []):
                products.append(PrescriptionProduct(
                    product_name=item.get("product_name", "Không xác định"),
                    dosage=item.get("dosage"),
                    quantity=item.get("quantity"),
                    usage_instruction=item.get("usage_instruction")
                ))
        else:  # invoice
            for item in extracted_data.get("products", []):
                products.append(InvoiceProduct(
                    product_name=item.get("product_name", "Không xác định"),
                    quantity=item.get("quantity"),
                    unit_price=item.get("unit_price"),
                    total_price=item.get("total_price")
                ))

        return {
            "document_type": document_type,
            "raw_text": ocr_text or "",
            "products": [p.model_dump() for p in products]
        }
    except Exception as e:
        logger.error(f"LLM extraction error: {str(e)}")
        # Trả về kết quả trống nếu có lỗi
        return {
            "document_type": document_type,
            "raw_text": ocr_text or "",
            "products": []
        }


async def process_document(
        file: UploadFile,
        request: DocumentExtractionRequest
) -> DocumentExtractionResponse:
    """
    Xử lý tài liệu y tế (đơn thuốc hoặc hóa đơn) và trích xuất thông tin sản phẩm.

    Args:
        file: File hình ảnh hoặc PDF được upload
        request: Thông tin yêu cầu xử lý

    Returns:
        Kết quả trích xuất tài liệu
    """
    try:
        # Đọc nội dung file để lưu vào DB sau này
        file_content = await file.read()
        await file.seek(0)  # Reset position để đọc lại sau này

        # Xác định loại file
        file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        if file_ext not in ['pdf', 'jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp']:
            raise HTTPException(
                status_code=400,
                detail=f"Định dạng file không được hỗ trợ: {file_ext}. Chỉ hỗ trợ PDF và hình ảnh phổ biến."
            )

        # Kiểm tra OCR khả dụng hay không
        ocr_available = is_tesseract_available()
        if not ocr_available and request.extraction_method in ["ocr", "hybrid"]:
            logger.warn("Tesseract OCR không khả dụng. Chuyển sang chế độ LLM.")
            request.extraction_method = "llm"

        # Lưu file tạm thời
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as temp_file:
            temp_file.write(file_content)
            temp_path = Path(temp_file.name)

        logger.info(f"Đã lưu file tạm thời tại: {temp_path}")

        # Xử lý dựa trên loại file
        if file_ext == 'pdf':
            logger.info("Xử lý file PDF trực tiếp...")

            ocr_text = ""  # Không cần OCR cho PDF

            # Xác định loại tài liệu (nếu auto thì dùng mặc định)
            document_type = request.document_type
            if document_type == "auto":
                document_type = "prescription"  # Mặc định là đơn thuốc với PDF

            # Xử lý theo phương pháp được chọn (với PDF luôn dùng LLM)
            logger.info(f"Sử dụng LLM để phân tích PDF")

            # Trích xuất thông tin từ PDF bằng LLM
            result = await extract_with_llm(
                file_path=temp_path,
                document_type=document_type,
                file_type="pdf",
                ocr_text=None
            )

            # Lưu kết quả vào MongoDB
            document_id = await save_document(
                document_type=result["document_type"],
                raw_text=result["raw_text"],
                products=result["products"],
                extraction_method="llm",  # Luôn dùng LLM cho PDF
                file_name=file.filename,
                file_content=file_content,
                user_id=request.user_id,
                total_pages=1,  # Không cần thông tin trang với phương pháp mới
                current_page=1
            )

            # Xóa file tạm
            os.unlink(temp_path)

            # Trả về kết quả
            return DocumentExtractionResponse(
                document_id=document_id,
                document_type=result["document_type"],
                raw_text=result["raw_text"],
                products=result["products"],
                extraction_method="llm",
                total_pages=1,
                current_page=1
            )

        else:  # Xử lý file hình ảnh (jpg, png, etc.)
            # Kiểm tra và chuyển đổi hình ảnh sang JPEG nếu cần
            if file_ext not in ["jpg", "jpeg", "png"]:
                try:
                    with Image.open(temp_path) as img:
                        # Chuyển đổi sang RGB nếu cần
                        if img.mode != 'RGB':
                            img = img.convert('RGB')
                        # Lưu lại cùng vị trí dưới dạng JPEG
                        jpg_path = Path(str(temp_path).rsplit('.', 1)[0] + '.jpg')
                        img.save(jpg_path, format="JPEG", quality=95)

                        # Xóa file gốc nếu cần và cập nhật đường dẫn
                        if jpg_path != temp_path:
                            os.unlink(temp_path)
                            temp_path = jpg_path

                        logger.info(f"Đã chuyển đổi hình ảnh từ {file_ext} sang JPEG")
                except Exception as e:
                    logger.warn(f"Không thể chuyển đổi hình ảnh: {str(e)}")

            # Trích xuất văn bản bằng OCR nếu cần
            ocr_text = ""
            if request.extraction_method in ["ocr", "hybrid"]:
                ocr_text = extract_text_from_image(temp_path)
                logger.info(f"Trích xuất OCR: {len(ocr_text)} ký tự")

            # Xác định loại tài liệu (nếu chưa được chỉ định)
            document_type = request.document_type
            if document_type == "auto":
                if ocr_text:
                    document_type = detect_layout_type(ocr_text)
                else:
                    document_type = "prescription"  # Mặc định là đơn thuốc

            logger.info(f"Loại tài liệu: {document_type}")
            logger.info(f"Phương pháp trích xuất: {request.extraction_method}")

            # Xử lý theo phương pháp được chọn
            if request.extraction_method == "ocr":
                # Vì OCR không khả dụng hoặc có lỗi, trả về kết quả trống
                logger.info("Sử dụng phương pháp OCR")
                result = {
                    "document_type": document_type,
                    "raw_text": ocr_text,
                    "products": []
                }

            elif request.extraction_method == "llm":
                # Chỉ sử dụng LLM
                logger.info("Sử dụng phương pháp LLM")
                result = await extract_with_llm(
                    file_path=temp_path,
                    document_type=document_type,
                    file_type="jpeg",
                    ocr_text=None
                )

            else:  # hybrid
                # Sử dụng cả OCR và LLM
                logger.info("Sử dụng phương pháp hybrid")
                result = await extract_with_llm(
                    file_path=temp_path,
                    document_type=document_type,
                    file_type="jpeg",
                    ocr_text=ocr_text
                )

            # Lưu kết quả vào MongoDB
            document_id = await save_document(
                document_type=result["document_type"],
                raw_text=result["raw_text"],
                products=result["products"],
                extraction_method=request.extraction_method,
                file_name=file.filename,
                file_content=file_content,
                user_id=request.user_id,
                total_pages=1,
                current_page=1
            )

            # Xóa file tạm
            os.unlink(temp_path)
            logger.info("Đã xóa file tạm thời")

            # Trả về kết quả
            return DocumentExtractionResponse(
                document_id=document_id,
                document_type=result["document_type"],
                raw_text=result["raw_text"],
                products=result["products"],
                extraction_method=request.extraction_method,
                total_pages=1,
                current_page=1
            )

    except Exception as e:
        logger.error(f"Lỗi xử lý tài liệu: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý tài liệu: {str(e)}")