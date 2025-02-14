from fastapi import APIRouter, UploadFile, HTTPException
from app.core.s3 import s3_client
import uuid

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile):
    try:
        url = await s3_client.upload_file(
            file,
            "images"
        )
        if url:
            return {"url": url}
        raise HTTPException(status_code=500, detail="Failed to upload file")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/file/{file_key}")
async def get_file_url(file_key: str):
    url = await s3_client.generate_presigned_url(file_key)
    if url:
        return {"url": url}
    raise HTTPException(status_code=404, detail="File not found")
