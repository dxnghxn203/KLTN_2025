from fastapi import APIRouter, HTTPException
from app.core.schemas import SuccessResponse, ErrorResponse

from app.entities.user import RegisterPhoneNumberRequest

router = APIRouter()

@router.post("/")
async def register_phoneNumber(req: RegisterPhoneNumberRequest):
    try:
        return SuccessResponse(message="Success", data={req.phoneNumber: "Registered"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_user_by_token(token: str):
    try:
        return SuccessResponse(message="Success", data={})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
