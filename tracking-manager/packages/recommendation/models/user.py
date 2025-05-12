from bson import ObjectId
from starlette import status

from core import response, logger
from core.mongo import db
from middleware.middleware import decode_jwt
import datetime
from typing import Optional, Union

from pydantic import BaseModel, Field, EmailStr

collection_name = "users"
class ItemUserRes(BaseModel):
    id: str = Field(..., alias='_id')
    phone_number: Optional[Union[str, None]] = None
    user_name: Optional[Union[str, None]] = None
    email: EmailStr = None
    gender: Optional[Union[str, None]] = None
    auth_provider: Optional[Union[str, None]] = None
    birthday: Optional[Union[datetime.datetime, None]] = None
    #image_url: Optional[Union[str, None]] = None
    role_id: Optional[Union[str, None]] = None
    active: bool = True
    verified_email_at: Optional[Union[datetime.datetime, None]] = None
    created_at: Optional[Union[datetime.datetime, None]] = None
    updated_at: Optional[Union[datetime.datetime, None]] = None
    token: Optional[Union[str, None]] = None
    password: Optional[Union[str, None]] = None

    @classmethod
    def from_mongo(cls, data):
        data['_id'] = str(data.get('_id'))
        return cls(**data)

async def get_by_id(user_id: str):
    try:
        collection = db[collection_name]
        user_info = collection.find_one({"_id": ObjectId(user_id)})
        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="User not found"
            )
        return user_info
    except Exception as e:
        logger.error(f"Error getting user by id: {str(e)}")
        raise e

async def get_current(token: str) -> ItemUserRes:
    try:
        payload = decode_jwt(token=token)
        user_info = await get_by_id(payload.get("username"))
        if user_info:
            user_info['token'] = token
            return ItemUserRes.from_mongo(user_info)
        return None
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error get_current user: {str(e)}")
        raise e