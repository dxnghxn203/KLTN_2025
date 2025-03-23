from fastapi import APIRouter, HTTPException, status, Form

from app.core import logger, response, mail
from app.core.authGoogle import google_auth
from app.core.response import BaseResponse
from app.entities.authen import GoogleAuthRequest, AuthRequest
from app.entities.user.response import ItemUserRes
from app.helpers import redis
from app.middleware import middleware
from app.models import user, auth

router = APIRouter()

@router.post("/authen/google-auth")
async def login(request: GoogleAuthRequest):
    try:
        authGoogle = await google_auth(request.id_token)
        if authGoogle is None or authGoogle == False:
            return response.BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Access token không hợp lệ!"
            )
        if authGoogle['email'] != request.email:
             return BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Email không hợp lệ!"
            )
        return response.BaseResponse(message="Success", data={"token": 'token'})
    except Exception as e:
        logger.error(f"Error google auth: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/login")
async def login(email: str = Form(), password: str = Form()):
    try:
        us = await user.get_by_email(email)
        if us is None:
            raise response.JsonException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Tên đăng nhập không tồn tại!"
            )
        isValid = await user.verify_user(us, password)
        if isValid is not None:
            if us['verified_email_at'] is None:
                check_request = redis.check_request_count(email)
                if not check_request:
                    ttl = redis.get_ttl(redis.request_count_key(email))
                    time_block = str(ttl) + " giây"
                    if ttl >= 60:
                        time_block = str(int(ttl / 60)) + " phút"
                    return response.JsonException(
                        status_code=status.HTTP_207_MULTI_STATUS,
                        message="Tài khoản đã bị khoá, hãy thực hiện lại sao " + time_block + " nữa!")
                else:
                    redis.update_otp_request_count_value(redis.request_count_key(email))

                otp = redis.get_otp(email)
                if otp is None:
                    otp = middleware.generate_otp()
                    redis.save_otp(email, otp)
                    mail.send_otp_email(email, otp)
                #
                return response.BaseResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    message="Tài khoản chưa xác thực. Vui lòng nhập OTP để xác thực!"
                )

            jwt = await auth.get_token(str(us["_id"]))

            res = ItemUserRes.from_mongo(us)
            res.token = jwt
            return response.SuccessResponse(data=res)
        else:
            raise response.JsonException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Tên đăng nhập hoặc mật khẩu không đúng!"
            )

    except Exception as e:
        raise e

@router.post("/authen/logout")
async def logout():
    try:
        return BaseResponse(message="Success", data={"token": 'token'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
