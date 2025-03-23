from fastapi import APIRouter, HTTPException, status
from app.core.authGoogle import google_auth
from app.core.schemas import SuccessResponse, ErrorResponse
from app.entities.authen import GoogleAuthRequest, AuthRequest

router = APIRouter()

@router.post("/authen/google-auth")
async def login(request: GoogleAuthRequest):
    try:
        authGoogle = await google_auth(request.id_token)
        if authGoogle is None or authGoogle == False:
            return ErrorResponse(
                code=status.HTTP_401_UNAUTHORIZED,
                message="Access token không hợp lệ!"
            )
        if authGoogle['email'] != request.email:
             return ErrorResponse(
                code=status.HTTP_401_UNAUTHORIZED,
                message="Email không hợp lệ!"
            )
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
