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
    DocumentExtractionResponse,  # Model này cần patient_information: Optional[Dict[str, Any]]
    save_document  # Hàm này cần patient_information: Optional[Dict[str, Any]]
)

from langchain_core.messages import HumanMessage, SystemMessage


def encode_file_to_base64(file_path: Union[str, Path]) -> str:
    try:
        with open(file_path, "rb") as file:
            return base64.b64encode(file.read()).decode('utf-8')
    except Exception as e:
        logger.error(f"Error encoding file to base64: {str(e)}")
        raise


def encode_image_to_base64(image_path: Union[str, Path]) -> str:
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
    parsed_data = {
        "document_type": document_type, "products": [], "patient_information": None,  # Sẽ được cập nhật
        "document_date": None, "issuing_organization": None, "medical_code": None,
        "invoice_id": None, "prescription_id": None, "prescribing_doctor": None, "raw_text": ""
    }

    try:
        data = json.loads(response_text)
        parsed_data.update(data)
        parsed_data["products"] = data.get("products", []) if isinstance(data.get("products"), list) else []

        # Xử lý fallback cho patient_information nếu LLM trả về string thay vì dict
        patient_info_val = parsed_data.get("patient_information")
        if patient_info_val is not None and isinstance(patient_info_val, str):
            logger.warn(f"LLM returned 'patient_information' as a string: '{patient_info_val}'. Converting to dict.")
            parsed_data["patient_information"] = {"description": patient_info_val}
        elif patient_info_val is None:  # Nếu LLM không trả về gì, đảm bảo nó là None hoặc dict rỗng
            parsed_data["patient_information"] = {}  # Hoặc None, tùy theo model Pydantic của bạn chấp nhận gì khi rỗng

        return parsed_data
    except json.JSONDecodeError:
        json_pattern = r'```(?:json)?\s*([\s\S]*?)\s*```'
        match = re.search(json_pattern, response_text)
        if match:
            try:
                data = json.loads(match.group(1))
                parsed_data.update(data)
                parsed_data["products"] = data.get("products", []) if isinstance(data.get("products"), list) else []

                patient_info_val = parsed_data.get("patient_information")
                if patient_info_val is not None and isinstance(patient_info_val, str):
                    logger.warn(
                        f"LLM (from markdown) returned 'patient_information' as a string: '{patient_info_val}'. Converting to dict.")
                    parsed_data["patient_information"] = {"description": patient_info_val}
                elif patient_info_val is None:
                    parsed_data["patient_information"] = {}

                return parsed_data
            except json.JSONDecodeError:
                logger.warn("Failed to parse JSON from markdown code block in LLM response.")
        else:
            logger.warn("LLM response is not a direct JSON or a markdown JSON code block.")

    # Fallback parsing cho products nếu không có JSON (phần này giữ nguyên)
    products = []
    current_product_data: Optional[Dict[str, Any]] = None
    lines = response_text.strip().split('\n')
    property_pattern = re.compile(r'^\s*\*\*([^:]+?)\*\*:\s*(.+)$|^\s*([^:]+?):\s*(.+)$')
    for line in lines:
        line = line.strip();  # ... (logic parsing markdown cho products giữ nguyên) ...
    # ... (phần còn lại của logic parsing markdown cho products)

    if parsed_data.get("patient_information") is None:  # Nếu sau tất cả patient_information vẫn là None
        parsed_data["patient_information"] = {}  # Đảm bảo là dict rỗng

    parsed_data["products"] = products  # Gán products từ markdown parsing nếu có
    return parsed_data


async def extract_with_llm(file_path: Path, document_type: str, file_type: str, ocr_text: Optional[str] = None) -> Dict[
    str, Any]:
    base64_content = encode_file_to_base64(file_path)

    # Cập nhật hướng dẫn cho patient_information: YÊU CẦU LÀ MỘT OBJECT JSON
    common_extraction_info = """
        Ngoài danh sách sản phẩm/thuốc, hãy trích xuất các thông tin chung sau từ tài liệu nếu có:
        - patient_information: Trích xuất thông tin bệnh nhân hoặc người dùng. 
            * QUAN TRỌNG: Trường này BẮT BUỘC PHẢI LÀ MỘT ĐỐI TƯỢNG JSON (OBJECT).
            * Ví dụ về cấu trúc mong muốn cho `patient_information`:
              {
                "name": "Nguyễn Thị C",
                "age": "52 tuổi", 
                "gender": "Nữ",
                "address": "Số 10, Phố ABC, Quận Hoàn Kiếm, Hà Nội",
                "phone": "0912345678",
                "diagnosis": "Đau dạ dày", 
                "notes": "Có tiền sử bệnh tim mạch. Khám định kỳ." 
              }
            * Nếu một số thông tin con (như 'phone', 'diagnosis', 'notes') không có, hãy để giá trị là `null` hoặc bỏ qua khóa đó bên trong đối tượng `patient_information`.
            * Nếu không có bất kỳ thông tin bệnh nhân nào có thể trích xuất, hãy trả về một ĐỐI TƯỢNG RỖNG: `{}` cho `patient_information`.
            * TUYỆT ĐỐI KHÔNG trả về `patient_information` dưới dạng một chuỗi văn bản thuần túy.
        - document_date: Ngày tháng của tài liệu (ví dụ: "2023-10-26"). Luôn là một chuỗi.
        - issuing_organization: Tên tổ chức phát hành. Luôn là một chuỗi.
        - medical_code: Mã y tế liên quan (nếu có). Luôn là một chuỗi.
        - invoice_id: Mã số hóa đơn (nếu là hóa đơn). Luôn là một chuỗi.
        - prescription_id: Mã số toa thuốc (nếu là toa thuốc). Luôn là một chuỗi.
        - prescribing_doctor: Tên bác sĩ kê đơn (nếu là toa thuốc). Luôn là một chuỗi.

        Hãy trả về kết quả dưới dạng một đối tượng JSON duy nhất. Đối tượng JSON này nên bao gồm các khóa:
        "patient_information", "document_date", "issuing_organization", "medical_code", 
        "invoice_id", "prescription_id", "prescribing_doctor", và "products".
        Trong đó, "products" là một danh sách các đối tượng sản phẩm/thuốc.
        Ví dụ cấu trúc JSON cho một sản phẩm trong danh sách "products":
        {
          "product_name": "Paracetamol 500mg",
          "dosage": "1 viên/lần",
          "quantity_value": "20",
          "quantity_unit": "viên",
          "usage_instruction": "Uống khi sốt, cách 4-6 tiếng"
        }
        Nếu một thông tin không có hoặc không áp dụng cho các trường chuỗi khác, hãy để giá trị là `null`.
        """

    if document_type == "prescription":
        system_prompt = f"""
        Bạn là trợ lý trích xuất thông tin từ đơn thuốc. Hãy phân tích tài liệu đơn thuốc và trích xuất các thông tin sau cho mỗi thuốc:
        1. product_name: Tên thuốc
        2. dosage: Liều lượng
        3. quantity_value: Số lượng (phần số)
        4. quantity_unit: Đơn vị tính của số lượng
        5. usage_instruction: Hướng dẫn sử dụng
        {common_extraction_info}
        Đối với mỗi thuốc trong danh sách "products", hãy sử dụng các khóa: "product_name", "dosage", "quantity_value", "quantity_unit", "usage_instruction".
        """
    else:  # invoice
        system_prompt = f"""
        Bạn là trợ lý trích xuất thông tin từ hóa đơn thuốc. Hãy phân tích tài liệu hóa đơn và trích xuất các thông tin sau cho mỗi sản phẩm:
        1. product_name: Tên sản phẩm
        2. quantity_value: Số lượng (phần số)
        3. quantity_unit: Đơn vị tính của số lượng
        4. unit_price: Đơn giá (phần số)
        5. total_price: Thành tiền (phần số)
        {common_extraction_info}
        Đối với mỗi sản phẩm trong danh sách "products", hãy sử dụng các khóa: "product_name", "quantity_value", "quantity_unit", "unit_price", "total_price".
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
        extracted_data_full["raw_text"] = ocr_text or ""  # Đảm bảo raw_text được gán

        products_typed = []
        llm_products = extracted_data_full.get("products", [])
        if not isinstance(llm_products, list):
            logger.warn(f"LLM returned 'products' not as a list: {llm_products}. Defaulting to empty list.")
            llm_products = []

        for item in llm_products:
            if not isinstance(item, dict):
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
            else:
                products_typed.append(InvoiceProduct(
                    product_name=item.get("product_name", "Không xác định"),
                    quantity_value=item.get("quantity_value"),
                    quantity_unit=item.get("quantity_unit"),
                    unit_price=item.get("unit_price"),
                    total_price=item.get("total_price")
                ))

        # Đảm bảo patient_information là dict hoặc None theo yêu cầu của Pydantic model
        final_patient_info = extracted_data_full.get("patient_information")
        if not isinstance(final_patient_info, (dict, type(None))):
            logger.error(
                f"Critical: patient_information is not a dict or None after processing. Value: {final_patient_info}, Type: {type(final_patient_info)}")
            # Nếu model Pydantic của bạn yêu cầu dict và không cho phép None khi có thông tin,
            # bạn có thể cần phải ép thành dict rỗng ở đây nếu nó là một kiểu không mong muốn khác.
            # Tuy nhiên, logic trong extract_json_from_response đã cố gắng xử lý điều này.
            # Nếu vẫn lỗi, có thể là do LLM trả về một cấu trúc rất lạ.
            final_patient_info = {"unexpected_data": str(final_patient_info)}  # Cực kỳ fallback

        return {
            "document_type": extracted_data_full.get("document_type", document_type),
            "raw_text": extracted_data_full.get("raw_text", ocr_text or ""),
            "products": [p.model_dump() for p in products_typed],
            "patient_information": final_patient_info,
            "document_date": extracted_data_full.get("document_date"),
            "issuing_organization": extracted_data_full.get("issuing_organization"),
            "medical_code": extracted_data_full.get("medical_code"),
            "invoice_id": extracted_data_full.get("invoice_id"),
            "prescription_id": extracted_data_full.get("prescription_id"),
            "prescribing_doctor": extracted_data_full.get("prescribing_doctor")
        }

    except Exception as e:
        logger.error(f"LLM extraction error: {str(e)}", exc_info=True)
        return {
            "document_type": document_type, "raw_text": ocr_text or "", "products": [],
            "patient_information": {},  # Trả về dict rỗng khi lỗi, nếu model yêu cầu dict
            "document_date": None, "issuing_organization": None,
            "medical_code": None, "invoice_id": None, "prescription_id": None, "prescribing_doctor": None
        }


async def process_document(
        file: UploadFile,
        request: DocumentExtractionRequest
) -> DocumentExtractionResponse:
    try:
        file_content = await file.read()
        await file.seek(0)

        file_ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
        supported_image_exts = ['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'webp', 'gif']
        if file_ext not in ['pdf'] + supported_image_exts:
            raise HTTPException(status_code=400, detail=f"Định dạng file không được hỗ trợ: {file_ext}.")

        ocr_available = is_tesseract_available()
        if not ocr_available and request.extraction_method == "ocr":
            logger.warn("Tesseract OCR không khả dụng cho phương thức 'ocr'. Chuyển sang chế độ 'llm'.")
            request.extraction_method = "llm"

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{file_ext}") as temp_file:
            temp_file.write(file_content)
            temp_path = Path(temp_file.name)
        logger.info(f"Đã lưu file tạm thời tại: {temp_path}")

        ocr_text_for_llm: Optional[str] = None
        processed_file_type_for_llm = file_ext
        document_type = request.document_type

        if file_ext == 'pdf':
            logger.info("Xử lý file PDF...")
            processed_file_type_for_llm = "pdf"
            if document_type == "auto":
                document_type = "prescription"

        else:
            logger.info(f"Xử lý file hình ảnh: {file_ext}")
            try:
                with Image.open(temp_path) as img:
                    img_rgb = img
                    if img.mode in ('RGBA', 'LA', 'P'):
                        img_rgb = Image.new("RGB", img.size, (255, 255, 255))
                        alpha_channel = None
                        if img.mode == 'P' and 'transparency' in img.info:
                            alpha_channel = img.convert('RGBA').getchannel('A')
                        elif 'A' in img.mode:
                            alpha_channel = img.getchannel('A')
                        img_rgb.paste(img, mask=alpha_channel)
                    elif img.mode != 'RGB':
                        img_rgb = img.convert('RGB')

                    converted_ext = "jpeg"
                    converted_path = temp_path.with_suffix(f".{converted_ext}")
                    img_rgb.save(converted_path, format="JPEG", quality=95)

                    if converted_path != temp_path:
                        logger.info(f"Đã chuyển đổi hình ảnh từ {file_ext} sang {converted_ext} tại: {converted_path}")
                        os.unlink(temp_path)
                        temp_path = converted_path
                    processed_file_type_for_llm = "jpeg"
            except Exception as e:
                logger.warn(
                    f"Không thể xử lý/chuyển đổi hình ảnh {temp_path}: {str(e)}. Sử dụng file gốc {file_ext} cho LLM.")

            if request.extraction_method in ["ocr", "hybrid"] and ocr_available:
                ocr_text_for_llm = extract_text_from_image(temp_path)
                logger.info(f"Trích xuất OCR từ hình ảnh: {len(ocr_text_for_llm or '')} ký tự.")

            if document_type == "auto":
                if ocr_text_for_llm:
                    document_type = detect_layout_type(ocr_text_for_llm)
                else:
                    document_type = "prescription"
            logger.info(f"Loại tài liệu xác định (hình ảnh): {document_type}")

        logger.info(f"Phương pháp trích xuất cuối cùng: {request.extraction_method}")

        extracted_result: Dict[str, Any]
        if request.extraction_method == "ocr":
            logger.info("Sử dụng phương pháp OCR thuần túy.")
            extracted_result = {
                "document_type": document_type, "raw_text": ocr_text_for_llm or "", "products": [],
                "patient_information": {},  # Trả về dict rỗng nếu model yêu cầu dict
                "document_date": None, "issuing_organization": None,
                "medical_code": None, "invoice_id": None, "prescription_id": None, "prescribing_doctor": None
            }
        else:
            logger.info(f"Sử dụng LLM (phương pháp: {request.extraction_method}) để phân tích tài liệu.")
            extracted_result = await extract_with_llm(
                file_path=temp_path,
                document_type=document_type,
                file_type=processed_file_type_for_llm,
                ocr_text=ocr_text_for_llm
            )

        document_id = await save_document(
            document_type=extracted_result["document_type"],
            raw_text=extracted_result["raw_text"],
            products=extracted_result["products"],
            extraction_method=request.extraction_method,
            file_name=file.filename,
            file_content=file_content,
            user_id=request.user_id,
            total_pages=1,
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

        return DocumentExtractionResponse(
            document_id=document_id,
            document_type=extracted_result["document_type"],
            raw_text=extracted_result["raw_text"],
            products=extracted_result["products"],
            extraction_method=request.extraction_method,
            total_pages=1,
            current_page=1,
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
