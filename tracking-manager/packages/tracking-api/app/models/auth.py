import os
from datetime import datetime, timedelta

import bcrypt
import jwt
from starlette import status

from app.core import logger, response, mail
from app.helpers import redis
from app.middleware.middleware import get_private_key, generate_otp

TOKEN_EXPIRY_SECONDS = 86400
collection_name = "authorizations"

async def get_token(username: str, role_id: str):
    token = redis.get_jwt_token(username)
    if token:
        return token
    expire = datetime.now() + timedelta(seconds=TOKEN_EXPIRY_SECONDS)
    payload = {"exp": expire, "username": username, "role_id": role_id}
    encoded_jwt = jwt.encode(payload, get_private_key(), algorithm=os.getenv("ALGORITHM"))
    redis.save_jwt_token(username, encoded_jwt)
    return encoded_jwt

async def handle_otp_verification(email: str):
    try:
        if not redis.check_request_count(email):
            ttl = redis.get_ttl(redis.request_count_key(email))
            logger.info(f"TTL for OTP request of {email}: {ttl}")
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
        logger.error(f"Error handle_otp_verification: {e}")
        raise e

async def verify_user(us: any, p: str):
    try:
        if us and bcrypt.checkpw(p.encode('utf-8'), us['password'].encode('utf-8')) and us['active']:
            logger.info("Đã đăng nhập thành công", username=us['user_name'])
            return us
        return None
    except Exception as e:
        raise e