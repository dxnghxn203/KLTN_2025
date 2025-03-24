import datetime

from pydantic import BaseModel, field_validator, model_validator

from app.common import password


class ItemUserRegisReq(BaseModel):
    phone_number: str
    user_name: str = None
    email: str = None
    password: str = None
    gender: str = "Nam"
    birthday: datetime.datetime = None

    @model_validator(mode='before')
    def validate_root(cls, values: dict):
        required_fields = ["user_name", "password", "phone_number", "email"]
        for field in required_fields:
            if not values.get(field):
                raise ValueError(f"{field} là bắt buộc.")
        return values

    @field_validator("user_name", mode='before')
    def validate_username(cls, v):
        if not v.strip():
            raise ValueError("Tên đăng nhập không được để trống.")
        return v

    @field_validator('email', mode='before')
    def validate_email(cls, v):
        if not v.strip():
            raise ValueError("Email không được để trống.")
        return v

    @field_validator("password", mode="before")
    def validate_password(cls, v):
        password.validate_password(v)
        return v

    @field_validator('birthday', mode="before")
    def validate_birthday(cls, v):
        try:
            parsed_date = datetime.datetime.fromisoformat(v.replace("Z", "+00:00"))
            parsed_date = parsed_date.replace(tzinfo=None)
            if parsed_date > datetime.datetime.now():
                raise ValueError("Ngày sinh không thể lớn hơn ngày hiện tại")
            return parsed_date
        except ValueError:
            raise ValueError("Định dạng ngày tháng không hợp lệ, yêu cầu ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)")


class ItemOtpReq(BaseModel):
    email: str

    @field_validator('email', mode='before')
    def validate_email(cls, v):
        if not v.strip():
            raise ValueError("Email không được để trống.")

        return v

class VerifyEmailReq(ItemOtpReq):
    otp: str
    @field_validator('otp')
    def otp_length(cls, value):
        if len(value) != 6:
            raise ValueError("OTP must be 6 characters long")
        return value