import base64
from datetime import datetime
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field, ConfigDict
import uuid

# Sử dụng MongoDB connection đã cấu hình
from core.mongo import db
from core import logger

# Collections
prescription_collection = db.prescriptions
invoice_collection = db.invoices


# Models
class PrescriptionProduct(BaseModel):
    product_name: str
    dosage: Optional[str] = None
    quantity_value: Optional[str] = None
    quantity_unit: Optional[str] = None
    usage_instruction: Optional[str] = None


class InvoiceProduct(BaseModel):
    product_name: str
    quantity_value: Optional[str] = None
    quantity_unit: Optional[str] = None
    unit_price: Optional[str] = None
    total_price: Optional[str] = None


class DocumentExtractionRequest(BaseModel):
    document_type: Optional[str] = "auto"  # "prescription", "invoice", or "auto"
    extraction_method: str = "hybrid"  # "ocr", "llm", or "hybrid"
    page: Optional[int] = None  # Trang cần trích xuất (cho PDF)
    user_id: Optional[str] = None  # ID người dùng


class DocumentExtractionResponse(BaseModel):
    document_id: str  # ID tài liệu
    document_type: str  # Loại tài liệu
    raw_text: Optional[str] = None  # Văn bản OCR thô (có thể là None nếu không có hoặc không áp dụng)
    products: List[Union[PrescriptionProduct, InvoiceProduct]]  # Sản phẩm đã trích xuất
    extraction_method: str  # Phương pháp trích xuất
    total_pages: Optional[int] = None  # Tổng số trang
    current_page: Optional[int] = None  # Trang hiện tại
    created_at: datetime = Field(default_factory=datetime.now)

    patient_information: Optional[Dict[str, Any]] = None
    document_date: Optional[str] = None  # Ngày tài liệu (chuỗi, ví dụ: "YYYY-MM-DD")
    issuing_organization: Optional[str] = None  # Tổ chức phát hành (chuỗi)

    model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})
    medical_code: Optional[str] = None
    invoice_id: Optional[str] = None
    prescription_id: Optional[str] = None
    prescribing_doctor: Optional[str] = None


async def save_document(
        document_type: str,
        raw_text: Optional[str],  # raw_text có thể là None
        products: List[Dict[str, Any]],
        extraction_method: str,
        file_name: str,
        file_content: bytes,
        user_id: Optional[str] = None,
        total_pages: Optional[int] = None,
        current_page: Optional[int] = None,
        patient_information: Optional[Dict[str, Any]] = None,
        document_date: Optional[str] = None,
        issuing_organization: Optional[str] = None,
        medical_code: Optional[str] = None,
        invoice_id: Optional[str] = None,
        prescription_id: Optional[str] = None,
        prescribing_doctor: Optional[str] = None
) -> str:
    """Lưu tài liệu vào MongoDB"""
    document_id = str(uuid.uuid4())

    document_data = {
        "document_id": document_id,
        "document_type": document_type,
        "raw_text": raw_text,
        "products": products,
        "extraction_method": extraction_method,
        "file_name": file_name,
        "file_content": base64.b64encode(file_content).decode('utf-8'),  # Lưu file content dưới dạng base64
        "created_at": datetime.now(),  # Sử dụng datetime object, MongoDB sẽ lưu thành ISODate
        "total_pages": total_pages,
        "current_page": current_page,
        "patient_information": patient_information,
        "document_date": document_date,  # Lưu dưới dạng chuỗi
        "issuing_organization": issuing_organization,
        "medical_code": medical_code,
        "invoice_id": invoice_id,
        "prescription_id": prescription_id,
        "prescribing_doctor": prescribing_doctor
    }

    if user_id:
        document_data["user_id"] = user_id

    try:
        collection_to_use = None
        if document_type == "prescription":
            collection_to_use = prescription_collection
        elif document_type == "invoice":
            collection_to_use = invoice_collection
        else:
            # Quyết định một collection mặc định hoặc raise lỗi nếu document_type không hợp lệ
            logger.warn(
                f"Document type '{document_type}' is not explicitly handled for collection selection. Defaulting or erroring.")
            # Ví dụ: default to prescriptions or raise error
            collection_to_use = prescription_collection  # Hoặc raise ValueError("Invalid document_type for saving")

        if collection_to_use is not None:
            collection_to_use.insert_one(document_data)
            logger.info(f"Document saved to MongoDB collection for '{document_type}' with ID: {document_id}")
        else:
            # This case should ideally be handled by the logic above
            logger.error(f"No collection determined for document_type: {document_type}. Document not saved.")
            raise ValueError(f"Could not determine collection for document_type: {document_type}")

        return document_id
    except Exception as e:
        logger.error(f"Failed to save document to MongoDB: {str(e)}")
        raise


async def get_document(document_id: str) -> Optional[Dict[str, Any]]:
    """Lấy thông tin tài liệu từ MongoDB"""
    # Tìm trong cả hai collection
    # Sử dụng await cho các hoạt động cơ sở dữ liệu với motor
    prescription_doc =  prescription_collection.find_one({"document_id": document_id})
    if prescription_doc:
        prescription_doc["_id"] = str(prescription_doc["_id"])  # Chuyển ObjectId thành string cho JSON serialization
        return prescription_doc

    invoice_doc =  invoice_collection.find_one({"document_id": document_id})
    if invoice_doc:
        invoice_doc["_id"] = str(invoice_doc["_id"])
        return invoice_doc

    return None


async def get_user_documents(
        user_id: str,
        document_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 10
) -> List[Dict[str, Any]]:
    """Lấy danh sách tài liệu của một người dùng"""
    query = {"user_id": user_id}

    if document_type:
        query["document_type"] = document_type

    # Loại bỏ file_content để giảm kích thước phản hồi
    projection = {"file_content": 0}

    all_results = []

    # Tìm trong collection prescriptions
    if document_type is None or document_type == "prescription":
        # Chú ý: to_list cần một argument 'length'
        cursor = prescription_collection.find(query, projection).skip(skip)  # .limit(limit) # Limit sau khi gộp
        prescription_docs =  cursor.to_list(
            length=limit if limit > 0 else None)  # length=None để lấy hết nếu limit=0
        for doc in prescription_docs:
            doc["_id"] = str(doc["_id"])
            all_results.append(doc)

    # Tìm trong collection invoices
    if document_type is None or document_type == "invoice":
        cursor = invoice_collection.find(query, projection).skip(skip)  # .limit(limit)
        invoice_docs =  cursor.to_list(length=limit if limit > 0 else None)
        for doc in invoice_docs:
            doc["_id"] = str(doc["_id"])
            all_results.append(doc)

    # Sắp xếp theo thời gian tạo (mới nhất trước) sau khi đã gộp kết quả
    # Đảm bảo created_at tồn tại và là datetime để sort, nếu không thì xử lý fallback
    all_results.sort(key=lambda x: x.get("created_at", datetime.min), reverse=True)

    # Áp dụng limit sau khi đã sort và gộp
    return all_results[:limit]

class DrugInformation(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    origin: Optional[str] = None
    serial_number: Optional[str] = None
    dosage_form: Optional[str] = None
    active_ingredients: Optional[List[str]] = None
    composition: Optional[str] = None
    manufacturer: Optional[str] = None
    expiration_date: Optional[str] = None
    batch_number: Optional[str] = None
    registration_number: Optional[str] = None
    additional_info: Optional[dict] = {}

class DrugExtractionResponse(BaseModel):
    drugs: List[DrugInformation] = []
    raw_text: Optional[str] = None
    extraction_method: str
