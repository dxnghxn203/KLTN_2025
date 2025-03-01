from fastapi import APIRouter, HTTPException
from app.core.schemas import SuccessResponse, ErrorResponse
from app.entities.authen import GoogleAuthRequest, AuthRequest

router = APIRouter()

@router.post("/authen/google-auth")
async def login(request: GoogleAuthRequest):
    try:
        return SuccessResponse(message="Success", data={"token": 'token'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/authen/login")
async def login(request: AuthRequest):
    try:
        return SuccessResponse(message="Success", data={"token": 'token'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/authen/logout")
async def logout():
    try:
        return SuccessResponse(message="Success", data={"token": 'token'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
