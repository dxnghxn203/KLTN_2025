from typing import Any

from pydantic import BaseModel


class JsonException(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message

class BaseResponse(BaseModel):
    code: int = 200
    status: str = None
    message: str = None
    data: Any = None


class SuccessResponse(BaseModel):
    status: str = "success"
    message: str = "Thành công!"
    data: Any = None