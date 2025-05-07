import json

from bson import ObjectId
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import WebSocket

from app.core import logger
from app.core.database import db

conversations = db['conversations']
messages = db['messages']


async def create_guest_conversation(guest_name: str, guest_email: Optional[str] = None,
                                    guest_phone: Optional[str] = None) -> Dict[str, Any]:
    """Tạo hội thoại mới cho khách không đăng nhập"""
    conversation_data = {
        "guest_name": guest_name,
        "guest_email": guest_email,
        "guest_phone": guest_phone,
        "guest_id": None,
        "pharmacist_id": None,
        "status": "waiting",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = conversations.insert_one(conversation_data)
    conversation_data["_id"] = result.inserted_id
    return conversation_data


async def create_user_conversation(user_id: str, guest_name: str, guest_email: Optional[str] = None,
                                   guest_phone: Optional[str] = None) -> Dict[str, Any]:
    """Tạo hội thoại mới cho người dùng đã đăng nhập"""
    conversation_data = {
        "guest_name": guest_name,
        "guest_email": guest_email,
        "guest_phone": guest_phone,
        "guest_id": user_id,
        "pharmacist_id": None,
        "status": "waiting",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }

    result = conversations.insert_one(conversation_data)
    conversation_data["_id"] = result.inserted_id
    return conversation_data


async def get_waiting_conversations(limit: int = 20) -> List[Dict[str, Any]]:
    """Lấy danh sách các hội thoại đang ở trạng thái chờ"""
    cursor = conversations.find({"status": "waiting"}).sort("created_at", 1).limit(limit)
    return cursor.to_list(length=limit)


async def get_conversation(conversation_id: str) -> Optional[Dict[str, Any]]:
    """Lấy thông tin chi tiết một hội thoại"""
    if not ObjectId.is_valid(conversation_id):
        return None

    return conversations.find_one({"_id": ObjectId(conversation_id)})


async def accept_conversation(conversation_id: str, pharmacist_id: str) -> Optional[Dict[str, Any]]:
    """Dược sĩ nhận một hội thoại"""
    if not ObjectId.is_valid(conversation_id):
        return None

    # Tìm và cập nhật hội thoại
    result = conversations.find_one_and_update(
        {"_id": ObjectId(conversation_id), "status": "waiting"},
        {"$set": {
            "pharmacist_id": pharmacist_id,
            "status": "active",
            "updated_at": datetime.utcnow()
        }},
        return_document=True
    )

    return result


async def update_conversation_status(conversation_id: str, status: str) -> Optional[Dict[str, Any]]:
    """Cập nhật trạng thái của hội thoại"""
    if not ObjectId.is_valid(conversation_id):
        return None

    result = await conversations.find_one_and_update(
        {"_id": ObjectId(conversation_id)},
        {"$set": {
            "status": status,
            "updated_at": datetime.utcnow()
        }},
        return_document=True
    )

    return result


# -------------------- MESSAGES --------------------

async def create_message(
        conversation_id: str,
        content: str,
        sender_type: str,
        sender_id: Optional[str] = None,
        message_type: str = "text"
) -> Dict[str, Any]:
    """Tạo tin nhắn mới"""
    message_data = {
        "conversation_id": conversation_id,
        "content": content,
        "sender_type": sender_type,
        "sender_id": sender_id,
        "message_type": message_type,
        "is_read": False,
        "created_at": datetime.utcnow()
    }

    result = messages.insert_one(message_data)
    message_data["_id"] = result.inserted_id

    # Cập nhật thời gian của cuộc hội thoại
    conversations.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$set": {"updated_at": datetime.utcnow()}}
    )

    return message_data


async def get_conversation_messages(conversation_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """Lấy tin nhắn của một hội thoại"""
    if not ObjectId.is_valid(conversation_id):
        return []

    cursor = messages.find({"conversation_id": conversation_id}).sort("created_at", 1).limit(limit)
    return cursor.to_list(length=limit)


async def mark_messages_as_read(conversation_id: str, reader_type: str) -> int:
    """Đánh dấu tin nhắn là đã đọc"""
    if not ObjectId.is_valid(conversation_id):
        return 0

    # Xác định loại người gửi tin nhắn (đối tác của người đọc)
    sender_type = "guest" if reader_type == "pharmacist" else "pharmacist"

    result =  messages.update_many(
        {"conversation_id": conversation_id, "sender_type": sender_type, "is_read": False},
        {"$set": {"is_read": True}}
    )

    return result.modified_count


# -------------------- WEBSOCKET HANDLING --------------------
async def handle_websocket_connection(
        websocket: WebSocket,
        conversation_id: str,
        client_type: str,
        user_id: Optional[str] = None,
        manager=None
) -> None:
    """
    Xử lý kết nối WebSocket và các tin nhắn qua lại giữa khách hàng và dược sĩ.
    """
    from app.core.websocket import manager as ws_manager
    import traceback

    if manager is None:
        manager = ws_manager

    # Kiểm tra loại client hợp lệ
    if client_type not in ["guest", "pharmacist"]:
        await websocket.close(code=1008, reason="Loại client không hợp lệ")
        return

    # Kiểm tra ID hội thoại hợp lệ
    if not ObjectId.is_valid(conversation_id):
        await websocket.close(code=1008, reason="ID hội thoại không hợp lệ")
        return

    conv_id = ObjectId(conversation_id)

    # Kiểm tra hội thoại tồn tại
    conversation = await get_conversation(conversation_id)
    if not conversation:
        await websocket.close(code=1008, reason="Hội thoại không tồn tại")
        return

    # Kiểm tra quyền tham gia hội thoại
    if client_type == "pharmacist":
        # Nếu hội thoại đã có dược sĩ và không phải user_id hiện tại
        if conversation.get("pharmacist_id") and conversation.get("pharmacist_id") != user_id:
            await websocket.close(code=1008, reason="Hội thoại này đã được dược sĩ khác tiếp nhận")
            return

        # Nếu hội thoại chưa có dược sĩ, cập nhật dược sĩ vào hội thoại
        if not conversation.get("pharmacist_id") and user_id:
            await accept_conversation(conversation_id, user_id)
            # Lấy thông tin hội thoại mới nhất
            conversation = await get_conversation(conversation_id)

    if client_type == "guest":
        # Nếu hội thoại có ID người dùng và không khớp với user_id hiện tại
        if conversation.get("guest_id") and conversation.get("guest_id") != user_id:
            await websocket.close(code=1008, reason="Bạn không được phép tham gia hội thoại này")
            return

    try:
        # Kết nối WebSocket
        await manager.connect(websocket, conv_id, client_type)

        # Thông báo kết nối thành công
        await websocket.send_json({
            "type": "connection_established",
            "conversation_id": str(conv_id),
            "conversation_info": {
                "guest_name": conversation.get("guest_name", ""),
                "status": conversation.get("status", "waiting"),
                "created_at": conversation.get("created_at").isoformat() if conversation.get("created_at") else None,
                "updated_at": conversation.get("updated_at").isoformat() if conversation.get("updated_at") else None
            }
        })

        # Gửi thông báo cho đối tác
        partner_type = "pharmacist" if client_type == "guest" else "guest"
        await manager.send_to_client(
            {
                "type": "partner_connected",
                "client_type": client_type,
                "timestamp": datetime.utcnow().isoformat()
            },
            conv_id,
            partner_type
        )

        # Lấy lịch sử tin nhắn
        messages_history = await get_conversation_messages(conversation_id)

        # Chuyển đổi ObjectId thành str trong tin nhắn và định dạng thời gian
        for msg in messages_history:
            if "_id" in msg:
                msg["_id"] = str(msg["_id"])
            # Định dạng datetime thành ISO string để dễ xử lý ở frontend
            if "created_at" in msg and isinstance(msg["created_at"], datetime):
                msg["created_at"] = msg["created_at"].isoformat()

        # Gửi lịch sử tin nhắn
        await websocket.send_json({
            "type": "message_history",
            "messages": messages_history
        })

        # Đánh dấu tin nhắn là đã đọc
        count = await mark_messages_as_read(conversation_id, client_type)

        # Thông báo cho đối tác nếu có tin nhắn được đánh dấu đã đọc
        if count > 0:
            await manager.send_to_client(
                {
                    "type": "messages_read",
                    "by": client_type,
                    "count": count,
                    "timestamp": datetime.utcnow().isoformat()
                },
                conv_id,
                partner_type
            )

        # Xử lý tin nhắn
        while True:
            # ===== THAY ĐỔI CHÍNH BẮT ĐẦU TỪ ĐÂY =====
            # Nhận tin nhắn từ client với xử lý lỗi nâng cao
            try:
                # Sử dụng receive_text() thay vì receive_json() để xử lý trước
                raw_data = await websocket.receive()

                # Kiểm tra loại tin nhắn WebSocket
                if raw_data["type"] == "websocket.disconnect":
                    logger.info(f"{client_type.capitalize()} client initiated disconnect")
                    break

                if raw_data["type"] != "websocket.receive":
                    logger.debug(f"Ignoring non-receive message: {raw_data['type']}")
                    continue

                # Lấy dữ liệu tin nhắn
                if "text" in raw_data:
                    # Phân tích dữ liệu JSON từ text
                    try:
                        data = json.loads(raw_data["text"])
                    except json.JSONDecodeError as e:
                        logger.warn(
                            f"Invalid JSON from {client_type}: {raw_data['text'][:100]}... - Error: {str(e)}")
                        await websocket.send_json({
                            "type": "error",
                            "message": "Invalid JSON format. Please send properly formatted JSON data.",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                        continue
                elif "bytes" in raw_data:
                    # Dữ liệu nhị phân - không hỗ trợ trong ví dụ này
                    logger.warn(f"Binary data received but not supported")
                    await websocket.send_json({
                        "type": "error",
                        "message": "Binary data not supported. Please send JSON text data.",
                        "timestamp": datetime.utcnow().isoformat()
                    })
                    continue
                else:
                    # Trường hợp không có dữ liệu
                    logger.warn(f"Received WebSocket message without data")
                    continue

                # Kiểm tra 'type' của tin nhắn
                if "type" not in data:
                    logger.warn(f"Received message without type field: {data}")
                    await websocket.send_json({
                        "type": "error",
                        "message": "Message type is required",
                        "timestamp": datetime.utcnow().isoformat()
                    })
                    continue

                # Xử lý message theo type
                if data["type"] == "message":
                    # Kiểm tra trường bắt buộc content
                    if "content" not in data or not data["content"].strip():
                        await websocket.send_json({
                            "type": "error",
                            "message": "Message content is required",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                        continue

                    # Tạo tin nhắn mới
                    new_message = await create_message(
                        conversation_id=conversation_id,
                        content=data["content"],
                        sender_type=client_type,
                        sender_id=user_id,
                        message_type=data.get("message_type", "text")
                    )

                    # Chuyển đổi ObjectId sang str và định dạng thời gian
                    if "_id" in new_message:
                        new_message["_id"] = str(new_message["_id"])
                    if "created_at" in new_message and isinstance(new_message["created_at"], datetime):
                        new_message["created_at"] = new_message["created_at"].isoformat()

                    # Gửi xác nhận đã nhận tin nhắn
                    await websocket.send_json({
                        "type": "message_sent",
                        "message_id": new_message["_id"],
                        "timestamp": datetime.utcnow().isoformat()
                    })

                    # Gửi tin nhắn đến đối tác
                    await manager.send_to_client(
                        {"type": "new_message", "message": new_message},
                        conv_id,
                        partner_type
                    )

                elif data["type"] == "typing":
                    # Kiểm tra trường is_typing
                    if "is_typing" not in data:
                        continue

                    # Gửi thông báo đang nhập đến đối tác
                    await manager.send_to_client(
                        {
                            "type": "typing_status",
                            "is_typing": data["is_typing"],
                            "client_type": client_type,
                            "timestamp": datetime.utcnow().isoformat()
                        },
                        conv_id,
                        partner_type
                    )

                elif data["type"] == "read_receipt":
                    # Đánh dấu tin nhắn là đã đọc
                    count = await mark_messages_as_read(conversation_id, client_type)

                    # Thông báo cho đối tác
                    if count > 0:
                        await manager.send_to_client(
                            {
                                "type": "messages_read",
                                "by": client_type,
                                "count": count,
                                "timestamp": datetime.utcnow().isoformat()
                            },
                            conv_id,
                            partner_type
                        )

                elif data["type"] == "close_conversation":
                    # Cập nhật trạng thái hội thoại thành đóng
                    await update_conversation_status(conversation_id, "closed")

                    # Thông báo đóng hội thoại cho cả hai bên
                    close_message = {
                        "type": "conversation_closed",
                        "closed_by": client_type,
                        "timestamp": datetime.utcnow().isoformat()
                    }

                    # Gửi thông báo cho người đóng
                    await websocket.send_json(close_message)

                    # Gửi thông báo cho đối tác
                    await manager.send_to_client(close_message, conv_id, partner_type)

                    # Đóng kết nối sau khi đóng hội thoại
                    await websocket.close(code=1000, reason="Conversation closed")
                    break

                elif data["type"] == "ping":
                    # Xử lý ping từ client (để giữ kết nối)
                    await websocket.send_json({
                        "type": "pong",
                        "timestamp": datetime.utcnow().isoformat()
                    })

                else:
                    # Type không được hỗ trợ
                    logger.warn(f"Unsupported message type: {data['type']}")
                    await websocket.send_json({
                        "type": "error",
                        "message": f"Unsupported message type: {data['type']}",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            except Exception as e:
                # Bắt tất cả các ngoại lệ khác khi xử lý tin nhắn
                logger.error(f"Error processing message: {str(e)}")
                logger.error(traceback.format_exc())

                # Thông báo lỗi cho client nhưng không đóng kết nối
                try:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Server error processing your message",
                        "timestamp": datetime.utcnow().isoformat()
                    })
                except:
                    # Nếu không gửi được thông báo lỗi thì có thể kết nối đã đóng
                    logger.error("Cannot send error message - connection might be closed")
                    break
            # ===== THAY ĐỔI CHÍNH KẾT THÚC Ở ĐÂY =====

    except Exception as e:
        error_msg = f"Error in websocket: {str(e)}"
        logger.error(error_msg)
        logger.error(traceback.format_exc())

        try:
            # Cố gắng đóng kết nối một cách lịch sự
            await websocket.close(code=1011, reason="Server error")
        except:
            pass

    finally:
        # Ngắt kết nối WebSocket
        disconnected_type = manager.disconnect(websocket, conv_id)

        if disconnected_type:
            # Thông báo cho đối tác
            partner_type = "pharmacist" if disconnected_type == "guest" else "guest"
            try:
                await manager.send_to_client(
                    {
                        "type": "partner_disconnected",
                        "client_type": disconnected_type,
                        "timestamp": datetime.utcnow().isoformat()
                    },
                    conv_id,
                    partner_type
                )
            except Exception as e:
                logger.error(f"Error sending disconnect notification: {str(e)}")