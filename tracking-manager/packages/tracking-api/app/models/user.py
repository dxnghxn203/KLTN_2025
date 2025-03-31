from datetime import datetime

from bson import ObjectId
from starlette import status

from app.core import database, logger, response, mail
from app.entities.user.request import ItemUserRegisReq
from app.entities.user.response import ItemUserRes
from app.helpers import redis
from app.middleware import middleware
from app.middleware.middleware import decode_jwt

collection_name = "users"

async def get_by_email_and_auth_provider(email: str, auth_provider: str):
    collection = database.db[collection_name]
    return collection.find_one({"email": email, "auth_provider": auth_provider})

async def get_all_user(page: int, pageSize: int):
    collection = database.db[collection_name]
    skip_count = (page - 1) * pageSize
    user_list = collection.find().skip(skip_count).limit(pageSize)
    return [ItemUserRes.from_mongo(user) for user in user_list]

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
        try:
            otp = middleware.generate_otp()
            redis.save_otp_and_update_request_count(item.email, otp)
            mail.send_otp_email(item.email, otp)

            return response.BaseResponse(
                status_code=status.HTTP_201_CREATED,
                status="created",
                message="Đã Đăng ký thành công"
            )
        except Exception as e:
            logger.error("Failed [add_user_email] :", error=e)
            collection = database.db[collection_name]
            collection.delete_one({"_id": user_id})
            raise e
    except Exception as e:
        logger.error(f"Failed [add_user_email] :{e}")
        raise e

async def add_user_google(email: str, user_name: str):
    try:
        existing_user = await get_by_email_and_auth_provider(email, 'google')
        if existing_user:
            return response.BaseResponse(
                message="Tài khoản Google đã tồn tại.",
                data={"user_id": str(existing_user["_id"])}
            )
        item = ItemUserRegisReq(
            email=email,
            user_name=user_name,
            phone_number="Google",
            password="Google@123",
            gender="Google",
            birthday=datetime.now()
        )

        user_id = await create_user(item, auth_provider="google", password="Google@123")

        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            status="created",
            message="Đã Đăng ký thành công",
            data={"user_id": str(user_id)}
        )
    except Exception as e:
        logger.error(f"Failed [add_user_google]: {e}")
        raise e

async def update_user_verification(email: str):
    collection = database.db[collection_name]
    collection.update_one({"email": email, "auth_provider": "email"}, {"$set": {"verified_email_at": datetime.utcnow()}})
    return response.SuccessResponse(message="Email đã được xác thực")

async def get_by_id(user_id: str):
    try:
        collection = database.db[collection_name]
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

async def update_status(user_id: str, status: bool):
    try:
        collection = database.db[collection_name]
        collection.update_one({"_id": ObjectId(user_id)}, {"$set": {"active": status}})
        return response.SuccessResponse(message=f"Cập nhật trạng thái user thành {status}")
    except Exception as e:
        logger.error(f"Error updating user status: {str(e)}")
        raise e

async def get_current(token: str) -> ItemUserRes:
    try:
        payload = decode_jwt(token=token)
        user_info = await get_by_id(payload.get("username"))
        if user_info:
            user_info['token'] = token
            return ItemUserRes.from_mongo(user_info)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error get_current user: {str(e)}")
        raise e