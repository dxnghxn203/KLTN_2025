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
    PrescriptionProduct,  # Giả định model này đã được cập nhật với quantity_value/unit
    InvoiceProduct,  # Giả định model này đã được cập nhật với quantity_value/unit
    DocumentExtractionRequest,
    DocumentExtractionResponse,  # Giả định model này đã được cập nhật với các trường thông tin mở rộng
    save_document  # Giả định hàm này đã được cập nhật để nhận các trường thông tin mở rộng
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
        with Image.open(image_path) as img:
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                background = Image.new('RGB', img.size, (255, 255, 255))
                if img.mode == 'P':
                    background.paste(img, mask=img.convert('RGBA').getchannel('A'))
                else:
                    background.paste(img, mask=img.getchannel('A'))
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')

            buffer = io.BytesIO()
            img.save(buffer, format="JPEG", quality=95)
            buffer.seek(0)
            return base64.b64encode(buffer.getvalue()).decode('utf-8')
    except Exception as e:
        logger.error(f"Error converting image to JPEG: {str(e)}")
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')


def extract_json_from_response(response_text: str, document_type: str) -> Dict[str, Any]:
    """
    Trích xuất thông tin từ phản hồi LLM. Ưu tiên JSON thuần túy.
    Nếu không phải JSON thuần túy, thử trích xuất từ markdown code block.
    Cuối cùng, thử phân tích văn bản markdown cho sản phẩm nếu các cách trên thất bại.
    Các trường thông tin chung chỉ được lấy từ JSON thuần túy hoặc JSON trong markdown.
    """
    parsed_data = {
        "document_type": document_type,
        "products": [],
        "patient_information": None,
        "document_date": None,
        "issuing_organization": None,
        "medical_code": None,
        "invoice_id": None,
        "prescription_id": None,
        "prescribing_doctor": None,
        "raw_text": ""
    }

    # Trường hợp 1 & 2: JSON thuần túy hoặc JSON trong code block markdown
    try:
        # Thử JSON thuần túy trước
        data = json.loads(response_text)
        parsed_data.update(data)
        # Đảm bảo products là list ngay cả khi LLM trả về null hoặc không có key
        parsed_data["products"] = data.get("products", []) if isinstance(data.get("products"), list) else []
        return parsed_data
    except json.JSONDecodeError:
        json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
        match = re.search(json_pattern, response_text)
        if match:
            try:
                data = json.loads(match.group(1))
                parsed_data.update(data)
                parsed_data["products"] = data.get("products", []) if isinstance(data.get("products"), list) else []
                return parsed_data
            except json.JSONDecodeError:
                logger.warn("Failed to parse JSON from markdown code block in LLM response.")
                # Sẽ chuyển sang phân tích markdown cho sản phẩm
        else:
            logger.warn("LLM response is not a direct JSON or a markdown JSON code block.")
            # Sẽ chuyển sang phân tích markdown cho sản phẩm

    # Trường hợp 3: Phân tích văn bản dạng markdown chỉ cho các sản phẩm (fallback)
    # Các trường thông tin chung sẽ không được trích xuất ở bước này.
    products = []
    current_product_data: Optional[Dict[str, Any]] = None  # Sử dụng dict để linh hoạt hơn
    lines = response_text.strip().split('\n')
    # Mẫu để nhận diện dòng thuộc tính (bắt đầu bằng ** hoặc chứa ":")
    # Chỉnh sửa để bắt cả hai kiểu key trong markdown: **Key**: Value hoặc Key: Value
    property_pattern = re.compile(r'^\s*\*\*([^:]+?)\*\*:\s*(.+)$|^\s*([^:]+?):\s*(.+)$')

    for line in lines:
        line = line.strip()
        if not line: continue

        prop_match = property_pattern.match(line)
        if prop_match:
            if not current_product_data: continue  # Bỏ qua nếu chưa có sản phẩm hiện tại

            # Xác định key và value từ match
            # Group 1&2 là cho **Key**: Value, Group 3&4 là cho Key: Value
            key_group1 = prop_match.group(1)
            value_group1 = prop_match.group(2)
            key_group2 = prop_match.group(3)  # Key không có markdown đậm
            value_group2 = prop_match.group(4)  # Value tương ứng

            prop_name = ""
            prop_value = ""

            if key_group1 is not None:  # Ưu tiên key có markdown đậm
                prop_name = key_group1.lower().strip()
                prop_value = value_group1.strip()
            elif key_group2 is not None:
                prop_name = key_group2.lower().strip()
                prop_value = value_group2.strip()

            if not prop_name: continue  # Nếu không parse được prop_name thì bỏ qua

            # Gán giá trị cho thuộc tính tương ứng
            if "liều" in prop_name or "hàm lượng" in prop_name:
                current_product_data["dosage"] = prop_value
            elif "số lượng (giá trị)" == prop_name or "quantity_value" == prop_name:
                current_product_data["quantity_value"] = prop_value
            elif "đơn vị tính (số lượng)" == prop_name or "quantity_unit" == prop_name:
                current_product_data["quantity_unit"] = prop_value
            elif "hướng dẫn" in prop_name or "cách dùng" in prop_name or "sử dụng" in prop_name:
                current_product_data["usage_instruction"] = prop_value
            elif "đơn giá" in prop_name or "giá" in prop_name:
                current_product_data["unit_price"] = prop_value
            elif "thành tiền" in prop_name or "tổng" in prop_name:
                current_product_data["total_price"] = prop_value
            # Giữ lại logic cũ cho "số lượng" nếu LLM trả về key cũ trong markdown (ít khả năng hơn với prompt mới)
            elif "số lượng" in prop_name or "lượng" in prop_name:  # Key này giờ ít dùng hơn
                # Cố gắng tách thô sơ, không đảm bảo chính xác cao
                match_qty = re.match(r"([\d\.]+)\s*(\S+.*)?", prop_value)
                if match_qty:
                    current_product_data["quantity_value"] = match_qty.group(1)
                    if match_qty.group(2):
                        current_product_data["quantity_unit"] = match_qty.group(2).strip()
                    else:
                        current_product_data["quantity_unit"] = None  # Hoặc một giá trị mặc định
                else:  # Nếu không match, gán cả vào value, unit là None
                    current_product_data["quantity_value"] = prop_value
                    current_product_data["quantity_unit"] = None


        # Nếu dòng không phải là thuộc tính và không bắt đầu bằng ký tự đặc biệt,
        # coi là sản phẩm mới
        elif not line.startswith(('*', '-', '+', '#')) or line.startswith(('* ', '- ', '+ ')):
            # Lưu sản phẩm hiện tại nếu có và có tên
            if current_product_data and current_product_data.get('product_name'):
                products.append(current_product_data)

            # Bắt đầu sản phẩm mới
            if line.startswith(('* ', '- ', '+ ')):
                line = line[2:].strip()  # Loại bỏ dấu đầu dòng

            # Tạo đối tượng sản phẩm mới dựa vào loại tài liệu
            current_product_data = {"product_name": line}  # Khởi tạo với tên sản phẩm
            if document_type == "prescription":
                current_product_data.update(
                    {"dosage": None, "quantity_value": None, "quantity_unit": None, "usage_instruction": None})
            else:  # invoice
                current_product_data.update(
                    {"quantity_value": None, "quantity_unit": None, "unit_price": None, "total_price": None})

    # Thêm sản phẩm cuối cùng nếu có và có tên
    if current_product_data and current_product_data.get('product_name'):
        products.append(current_product_data)

    parsed_data["products"] = products
    # raw_text sẽ được gán giá trị ocr_text (nếu có) trong hàm gọi extract_with_llm
    return parsed_data


async def extract_with_llm(file_path: Path, document_type: str, file_type: str, ocr_text: Optional[str] = None) -> Dict[
    str, Any]:
    base64_content = encode_file_to_base64(file_path)

    common_extraction_info = """
        Ngoài danh sách sản phẩm/thuốc, hãy trích xuất các thông tin chung sau từ tài liệu nếu có:
        - patient_information: Thông tin bệnh nhân hoặc người dùng (Tên, tuổi, địa chỉ, v.v. nếu có).
        - document_date: Ngày tháng của tài liệu (ngày kê đơn, ngày hóa đơn). Ví dụ: "2023-10-26".
        - issuing_organization: Tên tổ chức phát hành (phòng khám, bệnh viện, nhà thuốc).
        - medical_code: Mã y tế liên quan (ví dụ: mã bệnh nhân, mã hồ sơ bệnh án, mã khám bệnh nếu có).
        - invoice_id: Mã số hóa đơn (nếu đây là hóa đơn).
        - prescription_id: Mã số toa thuốc (nếu đây là toa thuốc).
        - prescribing_doctor: Tên bác sĩ kê đơn (nếu đây là toa thuốc và có thông tin).

        Hãy trả về kết quả dưới dạng một đối tượng JSON duy nhất. Đối tượng JSON này nên bao gồm các khóa:
        "patient_information", "document_date", "issuing_organization", "medical_code", 
        "invoice_id", "prescription_id", "prescribing_doctor", và "products".
        Trong đó, "products" là một danh sách các đối tượng sản phẩm/thuốc.
        Ví dụ cấu trúc JSON cho một sản phẩm trong danh sách "products":
        {
          "product_name": "Tên thuốc A",
          "dosage": "500mg",
          "quantity_value": "30",
          "quantity_unit": "viên",
          "usage_instruction": "Uống 1 viên/lần, ngày 2 lần sau ăn"
        }
        Hoặc cho hóa đơn:
        {
          "product_name": "Sản phẩm B",
          "quantity_value": "2",
          "quantity_unit": "hộp",
          "unit_price": "150000",
          "total_price": "300000"
        }
        Nếu một thông tin không có hoặc không áp dụng, hãy để giá trị là null.
        """

    if document_type == "prescription":
        system_prompt = f"""
        Bạn là trợ lý trích xuất thông tin từ đơn thuốc. Hãy phân tích tài liệu đơn thuốc và trích xuất các thông tin sau cho mỗi thuốc:
        1. product_name: Tên thuốc
        2. dosage: Liều lượng (ví dụ: 500mg, 1 viên/lần)
        3. quantity_value: Số lượng (chỉ phần số, ví dụ: 30, 1, 2.5)
        4. quantity_unit: Đơn vị tính của số lượng (ví dụ: viên, hộp, ml, tuýp, gói)
        5. usage_instruction: Hướng dẫn sử dụng (ví dụ: Uống sáng 1 viên, tối 1 viên sau ăn)
        {common_extraction_info}
        Đối với mỗi thuốc trong danh sách "products", hãy sử dụng các khóa: "product_name", "dosage", "quantity_value", "quantity_unit", "usage_instruction".
        Đảm bảo rằng `invoice_id` thường sẽ là null cho đơn thuốc, trừ khi đơn thuốc được tích hợp trong hóa đơn.
        """
    else:  # invoice
        system_prompt = f"""
        Bạn là trợ lý trích xuất thông tin từ hóa đơn thuốc. Hãy phân tích tài liệu hóa đơn và trích xuất các thông tin sau cho mỗi sản phẩm:
        1. product_name: Tên sản phẩm
        2. quantity_value: Số lượng (chỉ phần số, ví dụ: 2, 5, 10)
        3. quantity_unit: Đơn vị tính của số lượng (ví dụ: hộp, chai, vỉ, tuýp)
        4. unit_price: Đơn giá (chỉ phần số)
        5. total_price: Thành tiền (chỉ phần số)
        {common_extraction_info}
        Đối với mỗi sản phẩm trong danh sách "products", hãy sử dụng các khóa: "product_name", "quantity_value", "quantity_unit", "unit_price", "total_price".
        Đảm bảo rằng `prescription_id` và `prescribing_doctor` thường sẽ là null cho hóa đơn, trừ khi hóa đơn có chi tiết toa thuốc.
        """

    data_url: str
    if file_type.lower() == "pdf":
        data_url = f"data:application/pdf;base64,{base64_content}"
    elif file_type.lower() in ["jpeg", "jpg"]:
        data_url = f"data:image/jpeg;base64,{base64_content}"
    elif file_type.lower() == "png":
        data_url = f"data:image/png;base64,{base64_content}"
    elif file_type.lower() == "webp":
        data_url = f"data:image/webp;base64,{base64_content}"
    elif file_type.lower() == "gif":
        data_url = f"data:image/gif;base64,{base64_content}"
    else:
        data_url = f"data:application/octet-stream;base64,{base64_content}"
        logger.warn(f"Using fallback MIME type for file_type: {file_type}")

    user_content_parts: List[Dict[str, Any]] = [{"type": "image_url", "image_url": {"url": data_url}}]
    instructional_text = "Hãy phân tích tài liệu được cung cấp (hình ảnh/PDF) và trích xuất thông tin theo yêu cầu vào định dạng JSON đã chỉ định."

    if ocr_text:
        user_content_parts.append(
            {"type": "text", "text": f"Văn bản OCR (tham khảo thêm nếu cần, đặc biệt nếu hình ảnh mờ):\n{ocr_text}"})
        instructional_text = "Hãy phân tích hình ảnh và văn bản OCR kèm theo (nếu có) để trích xuất thông tin theo yêu cầu vào định dạng JSON đã chỉ định."

    user_content_parts.append({"type": "text", "text": instructional_text})
    messages = [SystemMessage(content=system_prompt), HumanMessage(content=user_content_parts)]

    try:
        logger.info(
            f"Calling LLM for {document_type} document ({file_type}). OCR text provided for ref: {bool(ocr_text)}")
        response = await llm.ainvoke(messages)
        content = response.content
        logger.debug(f"LLM response (first 500 chars): {content[:500]}...")

        extracted_data_full = extract_json_from_response(content, document_type)
        # Gán ocr_text vào raw_text của kết quả cuối cùng (nếu có),
        # vì extract_json_from_response khởi tạo raw_text là ""
        extracted_data_full["raw_text"] = ocr_text or ""

        products_typed = []
        # Đảm bảo 'products' là một list trước khi lặp
        llm_products = extracted_data_full.get("products", [])
        if not isinstance(llm_products, list):
            logger.warn(f"LLM returned 'products' not as a list: {llm_products}. Defaulting to empty list.")
            llm_products = []

        for item in llm_products:
            if not isinstance(item, dict):  # Bỏ qua nếu item không phải dict
                logger.warn(f"Skipping non-dict item in products list: {item}")
                continue
            if document_type == "prescription":
                products_typed.append(PrescriptionProduct(
                    product_name=item.get("product_name", "Không xác định"),
                    dosage=item.get("dosage"),
                    quantity_value=item.get("quantity_value"),
                    quantity_unit=item.get("quantity_unit"),
                    usage_instruction=item.get("usage_instruction")
                ))
            else:  # invoice
                products_typed.append(InvoiceProduct(
                    product_name=item.get("product_name", "Không xác định"),
                    quantity_value=item.get("quantity_value"),
                    quantity_unit=item.get("quantity_unit"),
                    unit_price=item.get("unit_price"),
                    total_price=item.get("total_price")
                ))

        # Trả về đầy đủ thông tin, bao gồm cả các trường mới
        return {
            "document_type": extracted_data_full.get("document_type", document_type),  # Ưu tiên từ LLM nếu có
            "raw_text": extracted_data_full.get("raw_text", ocr_text or ""),  # raw_text đã được gán ở trên
            "products": [p.model_dump() for p in products_typed],
            "patient_information": extracted_data_full.get("patient_information"),
            "document_date": extracted_data_full.get("document_date"),
            "issuing_organization": extracted_data_full.get("issuing_organization"),
            "medical_code": extracted_data_full.get("medical_code"),
            "invoice_id": extracted_data_full.get("invoice_id"),
            "prescription_id": extracted_data_full.get("prescription_id"),
            "prescribing_doctor": extracted_data_full.get("prescribing_doctor")
        }

    except Exception as e:
        logger.error(f"LLM extraction error: {str(e)}", exc_info=True)
        # Trả về cấu trúc đầy đủ với giá trị None nếu có lỗi nghiêm trọng
        return {
            "document_type": document_type, "raw_text": ocr_text or "", "products": [],
            "patient_information": None, "document_date": None, "issuing_organization": None,
            "medical_code": None, "invoice_id": None, "prescription_id": None, "prescribing_doctor": None
        }


async def process_document(
        file: UploadFile,
        request: DocumentExtractionRequest
) -> DocumentExtractionResponse:
    try:
        file_content = await file.read()
        await file.seek(0)  # Reset con trỏ file để đọc lại nếu cần

        file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        supported_image_exts = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp', 'gif']
        if file_ext not in ['pdf'] + supported_image_exts:
            raise HTTPException(status_code=400, detail=f"Định dạng file không được hỗ trợ: {file_ext}.")

        ocr_available = is_tesseract_available()
        # Nếu phương thức là OCR và OCR không khả dụng, chuyển sang LLM (áp dụng cho hình ảnh)
        if not ocr_available and request.extraction_method == "ocr":
            logger.warn("Tesseract OCR không khả dụng cho phương thức 'ocr'. Chuyển sang chế độ 'llm'.")
            request.extraction_method = "llm"
        # Nếu hybrid và OCR không khả dụng, nó sẽ hoạt động như 'llm' vì ocr_text sẽ rỗng

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as temp_file:
            temp_file.write(file_content)
            temp_path = Path(temp_file.name)
        logger.info(f"Đã lưu file tạm thời tại: {temp_path}")

        ocr_text_for_llm: Optional[str] = None  # Sẽ chỉ được điền cho hình ảnh và nếu phương thức là hybrid/ocr
        processed_file_type_for_llm = file_ext  # Loại file sẽ được gửi tới LLM (có thể thay đổi nếu chuyển đổi)
        document_type = request.document_type  # Loại tài liệu (prescription/invoice)

        if file_ext == 'pdf':
            logger.info("Xử lý file PDF...")
            processed_file_type_for_llm = "pdf"
            # Đối với PDF, chúng ta không chạy OCR từ Python ở đây. LLM sẽ xử lý file PDF trực tiếp.
            # ocr_text_for_llm sẽ là None.
            if document_type == "auto":
                document_type = "prescription"  # Mặc định cho PDF nếu auto

        else:  # Xử lý file hình ảnh
            logger.info(f"Xử lý file hình ảnh: {file_ext}")
            # Chuyển đổi hình ảnh sang định dạng chuẩn (ví dụ: JPEG) nếu cần thiết cho LLM và OCR
            try:
                with Image.open(temp_path) as img:
                    img_rgb = img
                    # Chuyển sang RGB nếu cần (ví dụ: cho ảnh PNG có kênh alpha)
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img_rgb = Image.new("RGB", img.size, (255, 255, 255))
                        # Đảm bảo mask được tạo đúng cách cho các mode khác nhau
                        alpha_channel = None
                        if img.mode == 'P' and 'transparency' in img.info:  # Palette with transparency
                            alpha_channel = img.convert('RGBA').getchannel('A')
                        elif 'A' in img.mode:  # RGBA, LA
                            alpha_channel = img.getchannel('A')
                        img_rgb.paste(img, mask=alpha_channel)

                    elif img.mode != 'RGB':
                        img_rgb = img.convert('RGB')

                    converted_ext = "jpeg"  # Ưu tiên JPEG cho LLM Vision
                    converted_path = temp_path.with_suffix(f".{converted_ext}")
                    img_rgb.save(converted_path, format="JPEG", quality=95)  # Pillow dùng "JPEG"

                    if converted_path != temp_path:
                        logger.info(f"Đã chuyển đổi hình ảnh từ {file_ext} sang {converted_ext} tại: {converted_path}")
                        os.unlink(temp_path)  # Xóa file gốc nếu khác
                        temp_path = converted_path  # Cập nhật temp_path tới file đã chuyển đổi

                    processed_file_type_for_llm = "jpeg"  # file_type cho LLM là jpeg

            except Exception as e:
                logger.warn(
                    f"Không thể xử lý/chuyển đổi hình ảnh {temp_path}: {str(e)}. Sử dụng file gốc {file_ext} cho LLM.")
                # processed_file_type_for_llm vẫn là file_ext gốc nếu chuyển đổi lỗi

            # Thực hiện OCR cho hình ảnh nếu phương thức yêu cầu và OCR khả dụng
            if request.extraction_method in ["ocr", "hybrid"] and ocr_available:
                ocr_text_for_llm = extract_text_from_image(temp_path)  # temp_path giờ là file ảnh đã xử lý (nếu có)
                logger.info(f"Trích xuất OCR từ hình ảnh: {len(ocr_text_for_llm or '')} ký tự.")

            # Xác định loại tài liệu cho hình ảnh
            if document_type == "auto":
                if ocr_text_for_llm:  # Ưu tiên dùng ocr_text để xác định nếu có
                    document_type = detect_layout_type(ocr_text_for_llm)
                else:  # Nếu không có ocr_text, hoặc document_type vẫn là auto
                    document_type = "prescription"  # Mặc định
            logger.info(f"Loại tài liệu xác định (hình ảnh): {document_type}")

        logger.info(f"Phương pháp trích xuất cuối cùng: {request.extraction_method}")

        extracted_result: Dict[str, Any]
        if request.extraction_method == "ocr":  # Chỉ áp dụng nếu OCR available và người dùng muốn kết quả OCR thô
            logger.info("Sử dụng phương pháp OCR thuần túy (chỉ cho hình ảnh và nếu OCR khả dụng).")
            # Kết quả OCR thuần túy sẽ không có cấu trúc sản phẩm chi tiết như LLM
            # và các trường thông tin mở rộng khác.
            extracted_result = {
                "document_type": document_type, "raw_text": ocr_text_for_llm or "", "products": [],
                "patient_information": None, "document_date": None, "issuing_organization": None,
                "medical_code": None, "invoice_id": None, "prescription_id": None, "prescribing_doctor": None
            }
        else:  # "llm" or "hybrid"
            logger.info(f"Sử dụng LLM (phương pháp: {request.extraction_method}) để phân tích tài liệu.")
            # Nếu hybrid, ocr_text_for_llm (từ hình ảnh) sẽ được truyền. Nếu PDF hoặc llm thuần cho ảnh, ocr_text_for_llm là None.
            extracted_result = await extract_with_llm(
                file_path=temp_path,
                document_type=document_type,
                file_type=processed_file_type_for_llm,  # "pdf" hoặc "jpeg" (hoặc file_ext gốc nếu chuyển đổi lỗi)
                ocr_text=ocr_text_for_llm
            )

        # Lưu kết quả vào DB
        document_id = await save_document(
            document_type=extracted_result["document_type"],
            raw_text=extracted_result["raw_text"],
            products=extracted_result["products"],  # products giờ đây sẽ chứa dicts với quantity_value/unit
            extraction_method=request.extraction_method,
            file_name=file.filename,
            file_content=file_content,
            user_id=request.user_id,
            total_pages=1,  # Giả sử 1 trang cho đơn giản
            current_page=1,
            patient_information=extracted_result.get("patient_information"),
            document_date=extracted_result.get("document_date"),
            issuing_organization=extracted_result.get("issuing_organization"),
            medical_code=extracted_result.get("medical_code"),
            invoice_id=extracted_result.get("invoice_id"),
            prescription_id=extracted_result.get("prescription_id"),
            prescribing_doctor=extracted_result.get("prescribing_doctor")
        )

        os.unlink(temp_path)
        logger.info("Đã xóa file tạm thời.")

        # Trả về kết quả
        return DocumentExtractionResponse(
            document_id=document_id,
            document_type=extracted_result["document_type"],
            raw_text=extracted_result["raw_text"],
            products=extracted_result["products"],  # Pydantic sẽ validate dựa trên model Product đã cập nhật
            extraction_method=request.extraction_method,
            total_pages=1,
            current_page=1,
            # Thêm các trường mới vào response object
            patient_information=extracted_result.get("patient_information"),
            document_date=extracted_result.get("document_date"),
            issuing_organization=extracted_result.get("issuing_organization"),
            medical_code=extracted_result.get("medical_code"),
            invoice_id=extracted_result.get("invoice_id"),
            prescription_id=extracted_result.get("prescription_id"),
            prescribing_doctor=extracted_result.get("prescribing_doctor")
        )

    except HTTPException as he:
        logger.error(f"HTTP Exception trong quá trình xử lý tài liệu: {str(he.detail)}")
        raise he
    except Exception as e:
        logger.error(f"Lỗi xử lý tài liệu không mong muốn: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý tài liệu nghiêm trọng: {str(e)}")
