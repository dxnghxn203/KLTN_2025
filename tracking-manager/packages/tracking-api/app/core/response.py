from typing import Any

from pydantic import BaseModel


class JsonException(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message

class BaseResponse(BaseModel):
    status_code: int = 200
    status: str = ""
    message: str = ""
    data: Any = None

class SuccessResponse(BaseModel):
    status_code: int = 200
    status: str = "success"
    message: str = "Thành công!"
    data: Any = None

class FailResponse(BaseModel):
    status_code: int = 400
    status: str = "fail"
    message: str