from datetime import datetime

from bson import ObjectId
from starlette import status

from app.core import database, logger, response, mail
from app.entities.admin.request import ItemAdminRegisReq
from app.entities.admin.response import ItemAdminRes
from app.helpers import redis
from app.helpers.constant import get_time
from app.middleware import middleware
from app.middleware.middleware import decode_jwt, generate_password

collection_name = "admin"

async def get_by_email(email: str):
    collection = database.db[collection_name]
    return collection.find_one({"email": email})

async def get_all_admin(page: int, page_size: int):
    collection = database.db[collection_name]
    skip_count = (page - 1) * page_size
    admin_list = collection.find().skip(skip_count).limit(page_size)
    return [ItemAdminRes.from_mongo(admin) for admin in admin_list]

async def create_admin(item: ItemAdminRegisReq):
    try:
        if not item:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message='Vui lòng nhập thông tin admin.'
            )

        if await get_by_email(item.email):
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Email đã tồn tại."
            )
        collection = database.db[collection_name]
        item_dict = item.dict()

        item_dict["password"] = middleware.hash_password(item.password)

        item_dict.update({
            "created_at": get_time(),
            "updated_at": get_time(),
            "verified_email_at": None,
            "role_id": "admin",
            "active": True,
            "auth_provider": "email",
        })

        insert_result = collection.insert_one(item_dict)
        logger.info(f"[create_admin] Đã thêm admin mới, ID: {insert_result.inserted_id}")
        admin_id = insert_result.inserted_id
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
            logger.error("Failed [create_admin] :", error=e)
            collection = database.db[collection_name]
            collection.delete_one({"_id": admin_id})
            raise e
    except Exception as e:
        logger.error(f"Failed [create_admin] :{e}")
        raise e

async def update_admin_verification(email: str):
    collection = database.db[collection_name]
    collection.update_one({"email": email}, {"$set": {"verified_email_at": get_time()}})
    return response.SuccessResponse(message="Email đã được xác thực")

async def get_by_id(admin_id: str):
    try:
        collection = database.db[collection_name]
        admin_info = collection.find_one({"_id": ObjectId(admin_id)})
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Admin not found"
            )
        return admin_info
    except Exception as e:
        logger.error(f"Error getting admin by id: {str(e)}")
        raise e

async def get_current(token: str) -> ItemAdminRes:
    try:
        payload = decode_jwt(token=token)
        admin_info = await get_by_id(payload.get("username"))
        if admin_info:
            admin_info['token'] = token
            return ItemAdminRes.from_mongo(admin_info)
        return None
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error get_current admin: {str(e)}")
        raise e

async def update_admin_password(email: str, new_password: str):
    try:
        collection = database.db[collection_name]
        collection.update_one(
            {"email": email},
            {"$set": {"password": middleware.hash_password(new_password), "updated_at": get_time()}})
        return response.SuccessResponse(message="Cập nhật mật khẩu thành công")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"[update_admin_password] Lỗi: {str(e)}")
        raise e