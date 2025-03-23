from fastapi import APIRouter, HTTPException

from app.core.mail import send_otp_email
from app.core.response import BaseResponse
from app.entities.user.request import ItemUserRegisReq, ItemVerifyOTPReq
from app.helpers import redis
from app.middleware.middleware import generate_otp
from app.models import user

router = APIRouter()

@router.post("/user/register_email")
async def register_email(req: ItemUserRegisReq):
    try:
        existing_user = await user.get_by_email(req.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email đã được sử dụng")

        if not redis.check_request_count(req.email):
            raise HTTPException(status_code=429, detail="Bạn đã yêu cầu OTP quá nhiều lần, hãy thử lại sau 30 phút.")

        otp = generate_otp()
        redis.save_otp_and_update_request_count(req.email, otp)

        email_response = send_otp_email(req.email, otp)
        if not email_response:
            raise HTTPException(status_code=500, detail="Lỗi khi gửi email OTP")

        return BaseResponse(message="OTP đã được gửi thành công")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/user/verify_otp")
async def verify_otp(req: ItemVerifyOTPReq):
    try:
        otp_result = redis.check_otp(req.email, req.otp)

        if not otp_result:
            raise HTTPException(status_code=400, detail="OTP không hợp lệ")

        redis.delete_otp_request(req.email)

        return BaseResponse(message="Xác thực OTP thành công")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))