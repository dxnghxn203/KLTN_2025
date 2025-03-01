from pydantic import BaseModel


class RegisterPhoneNumberRequest(BaseModel):
    phoneNumber: str
    fullName: str = None
    email: str = None
    address: str = None
    gender: str = None
    age: int = None
