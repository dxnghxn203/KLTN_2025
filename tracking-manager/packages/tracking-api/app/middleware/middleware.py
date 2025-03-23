import os
import random
import secrets
import string

import bcrypt
import jwt
from fastapi import Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import ValidationError

from app.core import logger, response
from app.helpers import redis as redis_helper

collection_name = "authorizations"
security = HTTPBearer(
    scheme_name='Authorization'
)


def verify_token(cred: HTTPAuthorizationCredentials = Depends(security)):
    if not cred:
        raise response.JsonException(status_code=status.HTTP_401_UNAUTHORIZED, message="Không có mã xác thực")
    if not cred.scheme == "Bearer":
        raise response.JsonException(status_code=status.HTTP_401_UNAUTHORIZED, message="Mã xác thực không hợp lệ")
    if not validate_jwt(cred.credentials):
        raise response.JsonException(status_code=status.HTTP_401_UNAUTHORIZED,
                            message="Mã xác thực không hợp lệ hoặc đã phiên đăng nhập đã hết hạn")
    return cred.credentials


def destroy_token(cred: HTTPAuthorizationCredentials = Depends(security)):
    if not cred:
        raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Không có mã xác thực")
    if not cred.scheme == "Bearer":
        raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Mã xác thực không hợp lệ")
    update_destroy_token(decode_jwt(cred.credentials))


def validate_jwt(jwt_token: str) -> bool:
    isTokenValid: bool = False
    try:
        payload = decode_jwt(jwt_token)
    except jwt.ExpiredSignatureError:
        payload = None  # Token hết hạn
    except jwt.InvalidTokenError:
        payload = None  # Token sai
    except Exception as e:
        logger.error(f"Lỗi khi decode JWT: {str(e)}")
        return False

    if payload:
        isTokenValid = check_validate_token(payload["username"])
    if not isTokenValid and payload is not None:
        update_destroy_token(payload)

    return isTokenValid


def check_validate_token(username: str):
    token = redis_helper.get_jwt_token(username)
    return True if token else False


def decode_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        return payload

    except jwt.ExpiredSignatureError:
        raise response.JsonException(
            status_code=status.HTTP_403_FORBIDDEN,
            message="Token has expired"
        )
    except(jwt.PyJWTError, ValidationError) as e:
        logger.error(f"Token decoding error: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_403_FORBIDDEN,
            message="Lỗi xác thực",
        )
    except Exception as e:
        logger.error("Token decoding", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


def update_destroy_token(payload):
    try:
        redis_helper.delete_jwt_token(payload["username"])
    except Exception as e:
        logger.error(f"updateDestroyToken error: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


def hash_password(password):
    password_bytes = password.encode('utf-8')
    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt(rounds=13, prefix=b"2b"))
    return hashed_bytes.decode('utf-8')

def generate_password():
    lower_case = string.ascii_lowercase
    upper_case = string.ascii_uppercase
    digits = string.digits
    special_chars = string.punctuation

    password_chars = [
        random.choice(lower_case),
        random.choice(upper_case),
        random.choice(digits),
        random.choice(special_chars)
    ]

    all_chars = lower_case + upper_case + digits + special_chars
    password_chars += random.choices(all_chars, k=8)

    random.shuffle(password_chars)
    return ''.join(password_chars)

def generate_otp():
    alphabet = string.digits + string.ascii_uppercase  # Generates OTP using digits and uppercase letters
    return ''.join(secrets.choice(alphabet) for _ in range(6))  # Creates a 6-character OTP
