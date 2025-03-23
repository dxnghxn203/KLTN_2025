import datetime
from typing import Optional, Union

from pydantic import BaseModel, Field, EmailStr


class ItemUserRes(BaseModel):
    id: str = Field(..., alias='_id')
    username: str
    email: EmailStr = None
    birthday: Optional[Union[datetime.datetime, None]] = None
    #image_url: Optional[Union[str, None]] = None
    role_id: Optional[Union[str, None]] = None
    active: bool = True
    verified_email_at: Optional[Union[datetime.datetime, None]] = None
    created_at: Optional[Union[datetime.datetime, None]] = None
    updated_at: Optional[Union[datetime.datetime, None]] = None
    token: Optional[Union[str, None]] = None

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)