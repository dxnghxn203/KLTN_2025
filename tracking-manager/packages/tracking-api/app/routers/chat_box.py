from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Body, Query, Path
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, EmailStr, Field

from app.models.chat_box import (
    create_guest_conversation,
    create_user_conversation,
    get_waiting_conversations,
    accept_conversation,
    get_conversation,
    handle_websocket_connection
)

router = APIRouter()


# --- Pydantic Models ---
class GuestConversationRequest(BaseModel):
    guest_name: str
    guest_email: Optional[EmailStr] = None
    guest_phone: Optional[str] = None


class UserConversationRequest(BaseModel):
    guest_name: str
    guest_email: Optional[EmailStr] = None
    guest_phone: Optional[str] = None


# --- API Endpoints ---

# 1. Tạo hội thoại mới (Guest)
@router.post("/conversations/guest", response_model=Dict[str, Any])
async def create_guest_chat(request: GuestConversationRequest = Body(...)):
    """Tạo hội thoại mới cho khách không đăng nhập"""
    conversation = await create_guest_conversation(
        guest_name=request.guest_name,
        guest_email=request.guest_email,
        guest_phone=request.guest_phone
    )

    # Chuyển ObjectId sang string
    if "_id" in conversation:
        conversation["_id"] = str(conversation["_id"])

    return conversation


# 2. Tạo hội thoại mới (User đã đăng ký)
@router.post("/conversations/user", response_model=Dict[str, Any])
async def create_user_chat(
        request: UserConversationRequest = Body(...),
        user_id: str = Query(..., description="ID của người dùng đã đăng ký")
):
    """Tạo hội thoại mới cho người dùng đã đăng ký"""
    conversation = await create_user_conversation(
        user_id=user_id,
        guest_name=request.guest_name,
        guest_email=request.guest_email,
        guest_phone=request.guest_phone
    )

    # Chuyển ObjectId sang string
    if "_id" in conversation:
        conversation["_id"] = str(conversation["_id"])

    return conversation


# 3. Lấy danh sách hội thoại đang chờ
@router.get("/conversations/waiting", response_model=List[Dict[str, Any]])
async def get_waiting_chats(limit: int = Query(20, ge=1, le=100)):
    """Lấy danh sách hội thoại đang chờ dược sĩ"""
    conversations = await get_waiting_conversations(limit)

    # Chuyển ObjectId sang string
    for conv in conversations:
        if "_id" in conv:
            conv["_id"] = str(conv["_id"])

    return conversations


# 4. Dược sĩ nhận hội thoại
@router.patch("/conversations/{conversation_id}/accept", response_model=Dict[str, Any])
async def accept_chat(
        conversation_id: str = Path(...),
        pharmacist_id: str = Query(..., description="ID của dược sĩ")
):
    """Dược sĩ nhận hội thoại để tư vấn"""
    conversation = await accept_conversation(conversation_id, pharmacist_id)

    if not conversation:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy hội thoại hoặc hội thoại không ở trạng thái chờ"
        )

    # Chuyển ObjectId sang string
    if "_id" in conversation:
        conversation["_id"] = str(conversation["_id"])

    return conversation


# 5. Lấy thông tin chi tiết hội thoại
@router.get("/conversations/{conversation_id}", response_model=Dict[str, Any])
async def get_chat_details(conversation_id: str = Path(...)):
    """Lấy thông tin chi tiết của hội thoại"""
    conversation = await get_conversation(conversation_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Không tìm thấy hội thoại")

    # Chuyển ObjectId sang string
    if "_id" in conversation:
        conversation["_id"] = str(conversation["_id"])

    return conversation


# 6. WebSocket Endpoint cho chat
@router.websocket("/ws/{conversation_id}/{client_type}")
async def websocket_chat(
        websocket: WebSocket,
        conversation_id: str,
        client_type: str,
        user_id: Optional[str] = None
):
    """WebSocket endpoint cho chat giữa khách hàng và dược sĩ"""
    await handle_websocket_connection(websocket, conversation_id, client_type, user_id)