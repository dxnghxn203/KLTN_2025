from fastapi import APIRouter
from starlette import status

from app.core import response, logger, mail
from app.core.response import BaseResponse, SuccessResponse
from app.entities.user.request import ItemUserRegisReq, ItemOtpReq, VerifyEmailReq
from app.helpers import redis
from app.middleware import middleware
from app.models import user

router = APIRouter()

@router.post("/user/register_email")
async def register_email(item: ItemUserRegisReq):
    try:
        return await user.add_user(item)
    except response.JsonException as e:
        raise e
    except Exception as e:
        logger.error("Error adding user", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )


@router.post("/users/otp")
async def send_otp(item: ItemOtpReq):
    email = item.email
    try:
        user_info = await user.get_by_email(email)

        if not isinstance(user_info, dict):
            return response.JsonException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Unexpected user data format"
            )

        if user_info is None:
            return response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message=f"User with email {email} not found"
            )

        check_request = redis.check_request_count(email)
        if not check_request:
            ttl = redis.get_ttl(redis.request_count_key(email))
            time_block = str(ttl) + " giây"
            if ttl >= 60:
                time_block = str(int(ttl / 60)) + " phút"
            return response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message=f"Bạn đã gửi quá số lần cho phép, hãy thực hiện lại sau {time_block} nữa!"
            )

        logger.info(f"user_info: {user_info}")

        if "verified_email_at" in user_info and user_info["verified_email_at"] is not None:
            return response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message="User already verified email"
            )

        otp = redis.get_otp(email)

        if otp is None:
            otp = middleware.generate_otp()
            redis.save_otp(email, otp)
            mail.send_otp_email(email, otp)

        redis.update_otp_request_count_value(redis.request_count_key(email))

        return SuccessResponse(message="Otp has been sent to your mail")

    except Exception as e:
        logger.error(f"error sending otp: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/users/verify-email", response_model=BaseResponse)
async def verify_user(request: VerifyEmailReq):
    email = request.email
    user_info = await user.get_by_email(email)
    if not user_info:
        return response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Email not found"
        )

    otp = redis.get_otp(email)

    check_request = redis.check_request_count(email)
    if not check_request:
        ttl = redis.get_ttl(redis.request_count_key(email))
        time_block = str(ttl) + " giây"
        if ttl >= 60:
            time_block = str(int(ttl / 60)) + " phút"
        return response.JsonException(
            status_code=status.HTTP_207_MULTI_STATUS,
            message=f"Bạn đã gửi quá số lần cho phép, hãy thực hiện lại sao {time_block} nữa!")
    redis.update_otp_request_count_value(redis.request_count_key(email))
    if otp is None or otp != request.otp:
        return response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="OTP is expired or not valid"
        )
    try:
        return await user.update_user_verification(email)
    except Exception as e:
        logger.error(f"Error verifying email = {email}: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )