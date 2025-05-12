from fastapi import APIRouter, Header, HTTPException, Depends, status  # Đổi FastAPI thành APIRouter
from pydantic import BaseModel
from typing import Annotated, Optional
import uuid

from core import logger
from middleware import middleware
from models import user
from services.chatbot import save_session_context

class UserInfoFromToken(BaseModel):
    id: str
    name: Optional[str] = "Quý khách"
    email: Optional[str] = None


from services.chatbot_service import handle_user_query as process_chat_query
from services.chatbot_helpers import get_session_context
from datetime import datetime

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
