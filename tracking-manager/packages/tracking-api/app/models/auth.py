import os
from datetime import datetime, timedelta

import jwt
from starlette import status

from app.core import logger, response, mail
from app.core.response import JsonException
from app.entities.user.response import ItemUserRes
from app.helpers import redis
from app.middleware.middleware import get_private_key, decode_jwt, generate_otp
from app.models import user

TOKEN_EXPIRY_SECONDS = 86400
collection_name = "authorizations"

async def get_token(username: str, role_id: str):
    expire = datetime.now() + timedelta(seconds=TOKEN_EXPIRY_SECONDS)
    payload = {"exp": expire, "username": username}
    if role_id == "admin":
        payload["rold_id"] = role_id
    encoded_jwt = jwt.encode(payload, get_private_key(), algorithm=os.getenv("ALGORITHM"))
    redis.save_jwt_token(username, encoded_jwt)
    return encoded_jwt

async def get_current(token: str) -> ItemUserRes:
    try:
        payload = decode_jwt(token=token)
        user_info = await user.get_by_id(payload.get("username"))
        if user_info:
            user_info['token'] = token
            return ItemUserRes.from_mongo(user_info)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error get_current user: {str(e)}")
        raise e

async def handle_otp_verification(email: str):
    try:
        if not redis.check_request_count(email):
            ttl = redis.get_ttl(redis.request_count_key(email))
            if ttl is None or not isinstance(ttl, int):
                ttl = 60

            time_block = f"{ttl} giây" if ttl < 60 else f"{ttl // 60} phút"
            raise response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message=f"Bạn đã gửi quá số lần cho phép, hãy thử lại sau {time_block}."
            )

        otp = redis.get_otp(email) or generate_otp()
        redis.save_otp(email, otp)
        redis.update_otp_request_count_value(email)
        mail.send_otp_email(email, otp)
        return otp
    except Exception as e:
        logger.error(f"Error handle_otp_verification: {str(e)}")
        raise e