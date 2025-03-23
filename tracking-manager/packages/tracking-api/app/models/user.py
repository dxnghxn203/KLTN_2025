from datetime import datetime

import bcrypt
from bson import ObjectId
from starlette import status

from app.core import database, logger, response, mail
from app.entities.user.request import ItemUserRegisReq
from app.helpers import redis
from app.middleware import middleware

collection_name = "users"

async def get_by_email(email: str):
    collection = database.db[collection_name]
    return collection.find_one({"email": email})

async def validate_add_user(item: ItemUserRegisReq):
    if item is None:
        logger.error("Vui lòng nhập thông tin user.")
        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message='Vui lòng nhập thông tin user.'
        )

    existsUser = await get_by_email(item.email)
    if existsUser is not None:
        logger.info(f"email đã tồn tại: {item.email}")
        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message='Username hoặc email đã tồn tại.'
        )

async def add_user(item: ItemUserRegisReq):
    await validate_add_user(item)
    try:
        collection = database.db[collection_name]
        item_dict = item.dict()

        item_dict['password'] = middleware.hash_password(item.password)
        item_dict['created_at'] = datetime.utcnow()
        item_dict['updated_at'] = datetime.utcnow()
        item_dict['verified_email_at'] = None
        item_dict['role_id'] = 'user'
        item_dict['active'] = True

        insert_result = collection.insert_one(item_dict)

        otp = middleware.generate_otp()
        redis.save_otp_and_update_request_count(item_dict['email'], otp)
        mail.send_otp_email(item_dict['email'], otp)
        logger.info("[add_user] Đã thêm user mới", _id=insert_result.inserted_id)

        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            status="created",
            message="Đã Đăng ký thành công"
        )
    except response.JsonException as e:

        logger.error("Failed [add_user] :", error=e.message)
        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=e.message
        )
    except Exception as e:
        logger.error("Failed [add_user] :", error=e)
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

async def update_user_verification(email: str):
    try:
        collection = database.db[collection_name]
        collection.update_one({"email": email}, {"$set": {"verified_email_at": datetime.utcnow()}})
        return response.SuccessResponse(message="Email đã được xác thực")
    except response.JsonException as e:
        raise e

async def verify_user(us: any, p: str):
    try:
        if us is None:
            return None
        if bcrypt.checkpw(p.encode('utf-8'), us['password'].encode('utf-8')):
            logger.info("Đã đăng nhập thành công", username=us['username'])
            return us
        return None

    except Exception as e:
        raise e

async def get_by_id(id: str):
    collection = database.db[collection_name]
    return collection.find_one({"_id": ObjectId(id)})
