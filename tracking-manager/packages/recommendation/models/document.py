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
    quantity: Optional[str] = None
    usage_instruction: Optional[str] = None


class InvoiceProduct(BaseModel):
    product_name: str
    quantity: Optional[str] = None
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
    raw_text: str  # Văn bản OCR thô
    products: List[Union[PrescriptionProduct, InvoiceProduct]]  # Sản phẩm đã trích xuất
    extraction_method: str  # Phương pháp trích xuất
    total_pages: Optional[int] = None  # Tổng số trang
    current_page: Optional[int] = None  # Trang hiện tại
    created_at: datetime = Field(default_factory=datetime.now)
    model_config = ConfigDict(json_encoders={datetime: lambda v: v.isoformat()})


async def save_document(
        document_type: str,
        raw_text: str,
        products: List[Dict[str, Any]],
        extraction_method: str,
        file_name: str,
        file_content: bytes,
        user_id: Optional[str] = None,
        total_pages: Optional[int] = None,
        current_page: Optional[int] = None,
) -> str:
    """Lưu tài liệu vào MongoDB"""
    document_id = str(uuid.uuid4())

    document = {
        "document_id": document_id,
        "document_type": document_type,
        "raw_text": raw_text,
        "products": products,
        "extraction_method": extraction_method,
        "file_name": file_name,
        "file_content": base64.b64encode(file_content).decode('utf-8'),
        "created_at": datetime.now(),
        "total_pages": total_pages,
        "current_page": current_page
    }

    if user_id:
        document["user_id"] = user_id

    try:
        # Lưu vào collection tương ứng
        if document_type == "prescription":
             prescription_collection.insert_one(document)
        else:  # invoice
             invoice_collection.insert_one(document)

        logger.info(f"Document saved to MongoDB with ID: {document_id}")
        return document_id
    except Exception as e:
        logger.error(f"Failed to save document to MongoDB: {str(e)}")
        raise


async def get_document(document_id: str) -> Optional[Dict[str, Any]]:
    """Lấy thông tin tài liệu từ MongoDB"""
    # Tìm trong cả hai collection
    prescription_doc =  prescription_collection.find_one({"document_id": document_id})
    if prescription_doc:
        prescription_doc["_id"] = str(prescription_doc["_id"])
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

    results = []

    # Tìm trong collection prescriptions
    if document_type is None or document_type == "prescription":
        prescription_docs =  prescription_collection.find(query, projection).skip(skip).limit(limit).to_list(
            length=limit)
        for doc in prescription_docs:
            doc["_id"] = str(doc["_id"])
            results.append(doc)

    # Tìm trong collection invoices
    if document_type is None or document_type == "invoice":
        invoice_docs =  invoice_collection.find(query, projection).skip(skip).limit(limit).to_list(length=limit)
        for doc in invoice_docs:
            doc["_id"] = str(doc["_id"])
            results.append(doc)

    # Sắp xếp theo thời gian tạo (mới nhất trước)
    results.sort(key=lambda x: x.get("created_at", ""), reverse=True)

    # Giới hạn kết quả theo limit
    return results[:limit]