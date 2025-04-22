from typing import Optional

from fastapi import APIRouter, Depends, Form
from starlette import status

from app.core import response, logger
from app.core.response import BaseResponse, SuccessResponse, JsonException
from app.entities.admin.request import ItemAdminRegisReq, ItemAdminOtpReq, ItemAdminVerifyEmailReq, \
    ItemAdminChangePassReq
from app.entities.admin.response import ItemAdminRes
from app.helpers import redis
from app.helpers.redis import delete_otp
from app.middleware import middleware
from app.models import auth, admin
from app.models.auth import handle_otp_verification, handle_password_verification

router = APIRouter()

@router.post("/admin/register")
async def register_email(item: ItemAdminRegisReq):
    try:
        return await admin.create_admin(item)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error register admin: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/admin/otp")
async def send_otp(item: ItemAdminOtpReq):
    try:
        email = item.email
        admin_info = await admin.get_by_email(email)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )
        if admin_info.get("verified_email_at"):
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

@router.post("/admin/verify-email", response_model=BaseResponse)
async def verify_user(request: ItemAdminVerifyEmailReq):
    try:
        email, otp = request.email, request.otp
        admin_info = await admin.get_by_email(email)

        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )

        if admin_info.get("verified_email_at"):
            raise response.JsonException(
                status_code=status.HTTP_207_MULTI_STATUS,
                message="Tài khoản đã được xác thực."
            )

        if redis.get_otp(email) != otp:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="OTP không hợp lệ hoặc đã hết hạn."
            )

        delete_otp(email)

        return await admin.update_admin_verification(email)
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error verify email: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/admin/login")
async def login(email: str = Form(), password: str = Form(), device_id: Optional[str] = Form(None)):
    try:
        ad = await admin.get_by_email(email)
        if not ad:
            raise JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )
        if not await auth.verify_password(ad["password"], password, ad["active"]):
            raise JsonException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Tên đăng nhập hoặc mật khẩu không đúng!"
            )

        if ad.get("verified_email_at") is None:
            await handle_otp_verification(email)
            return BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Tài khoản chưa xác thực. Vui lòng nhập OTP!"
            )

        device_id = device_id if device_id else "web"

        jwt_token = await auth.get_token(
            username=str(ad.get("_id")),
            role_id=ad.get("role_id"),
            device_id=device_id)
        res = ItemAdminRes.from_mongo(ad)
        res.token = jwt_token
        return SuccessResponse(message="Đăng nhập thành công", data=res)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error login email: {e}")
        return BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/admin/current", response_model=BaseResponse)
async def get_admin(token: str = Depends(middleware.verify_token)):
    try:
        data = await admin.get_current(token)
        return SuccessResponse(data=data)
    except Exception as e:
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/admin/forgot-password")
async def forgot_password(item: ItemAdminOtpReq):
    try:
        admin_info = await admin.get_by_email(item.email)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )
        new_password = await handle_password_verification(item.email)
        await admin.update_admin_password(item.email, new_password)
        return SuccessResponse(message="Mật khẩu mới đã được gửi đến email của bạn.")
    except response.JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error forgot password: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/admin/change-password")
async def change_password(item: ItemAdminChangePassReq, token: str = Depends(middleware.verify_token_admin)):
    try:
        admin_info = await admin.get_current(token)
        if not admin_info:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Quản trị viên không tồn tại."
            )

        if not await auth.verify_password(admin_info.password, item.old_password, admin_info.active):
            raise response.JsonException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Mật khẩu cũ không đúng!"
            )
        return await admin.update_admin_password(admin_info.email, item.new_password)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error(f"Error change password: {e}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )