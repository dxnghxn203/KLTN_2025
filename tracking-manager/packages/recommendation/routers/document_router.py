from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import List, Dict, Any, Optional

from core import logger, response
from services.document_extractor import process_document, extract_drug_information
from models.document import (
    DocumentExtractionRequest,
    DocumentExtractionResponse,
    get_document,
    get_user_documents, DrugExtractionResponse
)

router = APIRouter()



@router.post("/extract", response_model=DocumentExtractionResponse)
async def extract_document(
        file: UploadFile = File(...),
        document_type: Optional[str] = Form("auto"),
        extraction_method: str = Form("hybrid"),
        page: Optional[int] = Form(None),
        user_id: Optional[str] = Form(None)
):
    """
    Trích xuất thông tin từ đơn thuốc hoặc hóa đơn y tế.

    - **file**: File hình ảnh hoặc PDF chứa đơn thuốc hoặc hóa đơn
    - **document_type**: Loại tài liệu (prescription/invoice/auto)
    - **extraction_method**: Phương pháp trích xuất (ocr/llm/hybrid)
    - **page**: Số trang cần trích xuất (chỉ áp dụng cho PDF)
    - **user_id**: ID người dùng (tùy chọn)
    """
    # Kiểm tra file có phải là hình ảnh hoặc PDF không
    allowed_extensions = ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "webp", "heic", "heif", "pdf"]

    if not file.filename or "." not in file.filename:
        raise HTTPException(
            status_code=400,
            detail="Tên file không hợp lệ, không thể xác định định dạng"
        )

    file_ext = file.filename.split(".")[-1].lower()

    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Định dạng file không được hỗ trợ. Chỉ chấp nhận: {', '.join(allowed_extensions)}"
        )

    # Kiểm tra kích thước file (giới hạn 10MB)
    file_size_limit = 10 * 1024 * 1024  # 10MB
    file_content = await file.read()
    file_size = len(file_content)
    await file.seek(0)  # Đặt lại vị trí đọc file

    if file_size > file_size_limit:
        raise HTTPException(
            status_code=400,
            detail=f"Kích thước file vượt quá giới hạn cho phép (10MB)"
        )

    request = DocumentExtractionRequest(
        document_type=document_type,
        extraction_method=extraction_method,
        page=page,
        user_id=user_id
    )

    return await process_document(file, request)


@router.get("/documents/{document_id}")
async def get_document_by_id(document_id: str):
    """
    Lấy thông tin về một tài liệu đã trích xuất

    - **document_id**: ID của tài liệu
    """
    document = await get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Tài liệu không tồn tại")

    # Loại bỏ file_content để giảm kích thước phản hồi
    if "file_content" in document:
        del document["file_content"]

    return document


@router.get("/user/{user_id}/documents")
async def get_user_documents_endpoint(
        user_id: str,
        document_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 10
):
    """
    Lấy danh sách tài liệu của một người dùng

    - **user_id**: ID của người dùng
    - **document_type**: Loại tài liệu (prescription/invoice)
    - **skip**: Số lượng bản ghi bỏ qua
    - **limit**: Số lượng bản ghi trả về
    """
    if document_type and document_type not in ["prescription", "invoice"]:
        raise HTTPException(status_code=400, detail="Loại tài liệu không hợp lệ")

    documents = await get_user_documents(user_id, document_type, skip, limit)
    return documents


@router.post("/extract-drugs")
async def extract_drugs_from_images(
        files: List[UploadFile] = File(...),
        extraction_method: str = Form("hybrid")
):
    """
    Extract drug information from up to 2 images.

    - **files**: Up to 2 image files containing drug information
    - **extraction_method**: Extraction method (ocr/llm/hybrid)
    """
    try:
        # Validate number of files
        if len(files) > 2:
            logger.warn(f"Too many files submitted: {len(files)}")
            return response.BaseResponse(
                status_code=400,
                message="Maximum 2 images allowed",
                data=None
            )

        # Check file extensions
        allowed_extensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"]
        for file in files:
            if not file.filename or "." not in file.filename:
                logger.warn(f"Invalid filename: {file.filename}")
                return response.BaseResponse(
                    status_code=400,
                    message="Invalid file format. Only images are supported.",
                    data=None
                )

            file_ext = file.filename.split(".")[-1].lower()
            if file_ext not in allowed_extensions:
                logger.warn(f"Unsupported file extension: {file_ext}")
                return response.BaseResponse(
                    status_code=400,
                    message=f"Unsupported file format: {file_ext}. Only images are supported.",
                    data=None
                )

            # Check file size (limit to 5MB per file)
            file_size_limit = 5 * 1024 * 1024  # 5MB
            file_content = await file.read()
            file_size = len(file_content)
            await file.seek(0)

            if file_size > file_size_limit:
                logger.warn(f"File too large: {file.filename} ({file_size} bytes)")
                return response.BaseResponse(
                    status_code=400,
                    message=f"File {file.filename} is too large. Maximum size is 5MB per file.",
                    data=None
                )

        # Process files
        logger.info(f"Processing {len(files)} drug image(s) with {extraction_method} extraction method")
        result = await extract_drug_information(files, extraction_method)
        drug_response = DrugExtractionResponse(**result)

        return response.BaseResponse(
            status_code=200,
            message="Drug information extracted successfully",
            data=drug_response.dict()
        )

    except HTTPException as he:
        logger.error(f"HTTP Exception in drug extraction: {he.detail}")
        return response.BaseResponse(
            status_code=he.status_code,
            message=he.detail,
            data=None
        )
    except Exception as e:
        logger.error(f"Unexpected error in drug extraction: {str(e)}", exc_info=True)
        return response.BaseResponse(
            status_code=500,
            message=f"Error processing drug images: {str(e)}",
            data=None
        )