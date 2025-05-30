import base64
from fastapi import UploadFile

async def create_image_json_payload(file: UploadFile) -> dict:
    try:
        if not file:
            return {}

        file_name = file.filename
        file_type = file.content_type or "application/octet-stream"

        contents = await file.read()
        file_data = base64.b64encode(contents).decode("utf-8")
        await file.seek(0)

        return {
            "file_name": file_name,
            "file_data": file_data,
            "file_type": file_type
        }
    except Exception as e:
        print(f"Error creating image payload: {str(e)}")
        raise