from fastapi import APIRouter, HTTPException, status
from app.core.authGoogle import google_auth
from app.core.response import BaseResponse
from app.entities.authen import GoogleAuthRequest, AuthRequest

router = APIRouter()

@router.post("/authen/google-auth")
async def login(request: GoogleAuthRequest):
    try:
        authGoogle = await google_auth(request.id_token)
        if authGoogle is None or authGoogle == False:
            return BaseResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                message="Access token không hợp lệ!"
            )
        if authGoogle['email'] != request.email:
             return BaseResponse(
                staus_code=status.HTTP_401_UNAUTHORIZED,
                message="Email không hợp lệ!"
            )
        return BaseResponse(message="Success", data={"token": 'token'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/authen/login")
async def login(request: AuthRequest):
    try:
        return BaseResponse(message="Success", data={"token": 'token'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/authen/logout")
async def logout():
    try:
        return BaseResponse(message="Success", data={"token": 'token'})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
