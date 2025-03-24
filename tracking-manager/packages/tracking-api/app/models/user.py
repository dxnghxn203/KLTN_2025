from datetime import datetime

import bcrypt
from bson import ObjectId
from starlette import status

from app.core import database, logger, response, mail
from app.entities.user.request import ItemUserRegisReq
from app.helpers import redis
from app.middleware import middleware

collection_name = "users"

async def get_by_email_and_auth_provider(email: str, auth_provider: str):
    collection = database.db[collection_name]
    return collection.find_one({"email": email, "auth_provider": auth_provider})

async def create_user(item: ItemUserRegisReq, auth_provider: str, password: str = None):
    collection = database.db[collection_name]
    item_dict = item.dict()

    if password:
        item_dict["password"] = middleware.hash_password(password)

    item_dict.update({
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "verified_email_at": datetime.utcnow() if auth_provider == "google" else None,
        "role_id": "user",
        "active": True,
        "auth_provider": auth_provider,
    })

    insert_result = collection.insert_one(item_dict)
    logger.info(f"[create_user] Đã thêm user mới, ID: {insert_result.inserted_id}")
    return insert_result.inserted_id

async def add_user_email(item: ItemUserRegisReq):
    try:
        if not item:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message='Vui lòng nhập thông tin user.'
            )

        if await get_by_email_and_auth_provider(item.email, "email"):
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Email đã tồn tại."
            )
        user_id = await create_user(item, auth_provider="email", password=item.password)

        otp = middleware.generate_otp()
        redis.save_otp_and_update_request_count(item.email, otp)
        mail.send_otp_email(item.email, otp)

        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            status="created",
            message="Đã Đăng ký thành công"
        )
    except Exception as e:
        logger.error("Failed [add_user] :", error=e)
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

async def add_user_google(item: ItemUserRegisReq):
    try:
        if not item:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message='Vui lòng nhập thông tin user.'
            )

        existing_user = await get_by_email_and_auth_provider(item.email, 'google')
        if existing_user:
            return response.BaseResponse(
                message="Tài khoản Google đã tồn tại.",
                data={"user_id": str(existing_user["_id"])}
            )

        user_id = await create_user(item, auth_provider="google")

        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            status="created",
            message="Đã Đăng ký thành công",
            data={"user_id": str(user_id)}
        )
    except Exception as e:
        logger.error("Failed [add_user] :", error=e)
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

async def update_user_verification(email: str):
    collection = database.db[collection_name]
    collection.update_one({"email": email}, {"$set": {"verified_email_at": datetime.utcnow()}})
    return response.SuccessResponse(message="Email đã được xác thực")

async def verify_user(us: any, p: str):
    try:
        if us and bcrypt.checkpw(p.encode('utf-8'), us['password'].encode('utf-8')) and us['active']:
            logger.info("Đã đăng nhập thành công", username=us['user_name'])
            return us
        return None
    except Exception as e:
        raise e

async def get_by_id(id: str):
    collection = database.db[collection_name]
    return collection.find_one({"_id": ObjectId(id)})
