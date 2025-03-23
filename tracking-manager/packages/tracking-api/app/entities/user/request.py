from pydantic import BaseModel


class ItemUserRegisReq(BaseModel):
    phone_number: str
    user_name: str = None
    email: str = None
    password: str = None
    gender: str = None
    birthday: str = None

class ItemVerifyOTPReq(BaseModel):
    email: str
    otp: str