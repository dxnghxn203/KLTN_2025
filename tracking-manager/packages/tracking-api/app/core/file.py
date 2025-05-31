import base64
from fastapi import UploadFile

async def create_image_json_payload(file: UploadFile) -> dict:
    try:
        if not file:
            return {}

        file_name = file.filename
        file_type = file.content_type or "application/octet-stream"

        try:
            contents = await file.read()
            try:
                await file.seek(0)
            except Exception:
                pass
        except Exception as e:
            return {}

        file_data = base64.b64encode(contents).decode("utf-8")

        return {
            "file_name": file_name,
            "file_data": file_data,
            "file_type": file_type
        }
    except Exception as e:
        return {}