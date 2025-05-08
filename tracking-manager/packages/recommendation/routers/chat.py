# main.py
from fastapi import APIRouter, Header, HTTPException, Depends, status  # Đổi FastAPI thành APIRouter
from pydantic import BaseModel
from typing import Annotated, Optional
import uuid

from core import logger
from middleware import middleware
from models import user
from services.chatbot import save_session_context


# Import UserInfo model và hàm get_current
# class UserInfoFromToken(BaseModel): ... (đã định nghĩa ở trên hoặc import)
# async def get_current_user_placeholder(token: str) -> Optional[UserInfoFromToken]: ... (đã định nghĩa)
# async def verify_token_placeholder_str(authorization: Annotated[Optional[str], Header()] = None) -> str: ... (đã định nghĩa)

# --- Giả sử các định nghĩa này đã có sẵn hoặc được import ---
class UserInfoFromToken(BaseModel):
    id: str
    name: Optional[str] = "Quý khách"
    email: Optional[str] = None


from services.chatbot_service import handle_user_query as process_chat_query
from services.chatbot_helpers import get_session_context
from datetime import datetime

# Đổi app = FastAPI() thành router = APIRouter()
router = APIRouter()


class InitSessionResponse(BaseModel):
    session_id: str
    user_name: Optional[str] = None
    message: str


class ChatMessageRequest(BaseModel):
    session_id: str
    query: str


class ChatMessageResponse(BaseModel):
    answer: str
    session_id: str


# Đường dẫn của API giờ sẽ là /v1/chatbot/session/init (do prefix của router)
@router.post("/session/init", response_model=InitSessionResponse)
async def init_chatbot_session(
        token: str = Depends(middleware.verify_token)
):
    current_user = await user.get_current(token)
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found for the provided token."
        )

    session_id_for_user = current_user.id
    context = get_session_context(session_id_for_user)

    context["user_id"] = current_user.id
    context["user_name"] = current_user.user_name
    context["user_email"] = current_user.email
    context["access_token"] = token
    context["is_registered_user"] = True
    context["last_interaction_time"] = datetime.utcnow().isoformat()
    context.setdefault("recently_mentioned_products", [])
    context.setdefault("last_explicit_product", None)
    context.setdefault("disambiguation_options", None)
    context.setdefault("pending_action", None)
    if "current_cart" in context: del context["current_cart"]

    save_session_context(session_id_for_user, context)

    print(f"INFO API: Session initialized for user_id: {session_id_for_user}, Name: {current_user.user_name}")
    return InitSessionResponse(
        session_id=session_id_for_user,
        user_name=current_user.user_name,
        message="Chat session initialized successfully for registered user."
    )


# Đường dẫn của API giờ sẽ là /v1/chatbot/message
@router.post("/message", response_model=ChatMessageResponse)
async def chat_message_endpoint(request_body: ChatMessageRequest):
    if not request_body.query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    if not request_body.session_id:
        raise HTTPException(status_code=400, detail="session_id is required")

    response_data = await process_chat_query(
        session_id=request_body.session_id,
        user_query=request_body.query
    )
    return ChatMessageResponse(answer=response_data["answer"], session_id=response_data["session_id"])

# Để chạy ứng dụng này, bạn sẽ cần một file FastAPI chính (ví dụ: app_main.py)
# để import và include router này.

# Ví dụ: trong một file app_main.py hoặc tương tự:
# from fastapi import FastAPI
# from .routers import chatbot_router # Giả sử main.py hiện tại được đổi tên thành chatbot_router.py và nằm trong thư mục routers
#
# app = FastAPI()
# app.include_router(chatbot_router.router) # Include router vào ứng dụng chính
#
# # Hoặc nếu main.py này là file gốc của bạn:
# # from fastapi import FastAPI
# # # (để router = APIRouter(...) ở trên)
# # app = FastAPI()
# # app.include_router(router) # Include router vừa định nghĩa