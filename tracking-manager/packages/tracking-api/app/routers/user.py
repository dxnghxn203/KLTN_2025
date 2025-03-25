from fastapi import APIRouter, Depends
from starlette import status

from app.core import response, logger
from app.core.response import BaseResponse, SuccessResponse
from app.entities.user.request import ItemUserRegisReq, ItemOtpReq, VerifyEmailReq
from app.helpers import redis
from app.middleware import middleware
from app.models import user, auth
from app.models.auth import handle_otp_verification

router = APIRouter()

@router.post("/user/register_email")
async def register_email(item: ItemUserRegisReq):
    try:
        return await user.add_user_email(item)
    except Exception as e:
        logger.error(f"Error register email: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/users/otp")
async def send_otp(item: ItemOtpReq):
    try:
        email = item.email
        user_info = await user.get_by_email_and_auth_provider(email, "email")
        if user_info.get("verified_email_at"):
            raise response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message="Tài khoản đã được xác thực."
            )

        await handle_otp_verification(email)
        return SuccessResponse(message="OTP đã được gửi đến email của bạn.")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error send otp: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/users/verify-email", response_model=BaseResponse)
async def verify_user(request: VerifyEmailReq):
    try:
        email, otp = request.email, request.otp
        user_info = await user.get_by_email_and_auth_provider(email, "email")

        if not user_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Người dùng không tồn tại."
            )

        if user_info.get("verified_email_at"):
            raise response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message="Tài khoản đã được xác thực."
            )

        if redis.get_otp(email) != otp:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="OTP không hợp lệ hoặc đã hết hạn."
            )

        return await user.update_user_verification(email)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error verify email: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/users/current", response_model=BaseResponse)
async def get_users(token: str = Depends(middleware.verify_token)):
    try:
        data = await auth.get_current(token)
        return SuccessResponse(data=data)
    except Exception as e:
        logger.error(f"Error getting current user: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )