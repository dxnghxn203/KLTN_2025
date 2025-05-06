from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, WebSocketException, status, Depends
from typing import Optional

from app.core import logger, response
from app.core.websocket import manager
from app.entities.chat_box.response import WaitingConversationInfo
from app.helpers.redis import get_session, save_session
from app.middleware import middleware
from app.models import chat_box, pharmacist
from app.models.chat_box import CLOSED, WAITING, ACTIVE

router = APIRouter()

@router.websocket("/guest/chat_box")
async def guest_websocket_endpoint(
    websocket: WebSocket,
    session_id: Optional[str] = Query(None, description="Session ID của khách (nếu đã có)"),
):
    check = get_session(session_id)
    cur_session = session_id if check else save_session()
    logger.info(f"Guest {session_id} connected to chat box with session {cur_session}")
    try:
        conversation = await chat_box.get_or_create_conversation(
            participant_id=cur_session,
            participant_type='guest'
        )
        conversation_id = conversation.id
    except Exception as e:
        logger.error(f"Error getting/creating conversation for guest {session_id}: {e}")
        await websocket.close(code=status.WS_1011_INTERNAL_ERROR, reason="Database error")
        return

    await manager.connect(websocket, conversation_id, 'guest')
    try:
        history = await chat_box.get_messages_for_conversation(conversation_id, limit=50)
        await manager.send_to_client(
            {"type": "history", "payload": [msg.model_dump(mode='json') for msg in history]},
            conversation_id,
            'guest'
        )
    except Exception as e:
        logger.error(f"Error fetching history for conv {conversation_id}: {e}")

    if conversation.pharmacist_ref:
        await manager.send_to_client(
            {"type": "pharmacist_joined", "payload": {"pharmacist_name": conversation.pharmacist_ref.name}},
            conversation_id,
            'guest'
        )
    else:
        await manager.send_to_client(
            {"type": "system", "payload": "Đang chờ dược sĩ kết nối..."},
            conversation_id,
            'guest'
        )

    try:
        while True:
            try:
                data = await websocket.receive_json()
                message_type = data.get("type")
                payload = data.get("payload", {})
            except WebSocketDisconnect:
                logger.info(f"Guest {session_id} clean disconnect signal during receive in conv {conversation_id}")
                break
            except Exception as receive_error:
                logger.warn(f"Error receiving from guest {session_id} (assuming disconnect): {receive_error}")
                break

            if message_type == "message":
                content_text = payload.get("text")
                content_image_url = payload.get("image_url")

                if not content_text and not content_image_url:
                    logger.warn(f"Empty message received from guest {session_id}")
                    continue

                try:
                    saved_message = await chat_box.save_message(
                        conversation_id=conversation_id,
                        sender_id=session_id,
                        sender_type='guest',
                        content_text=content_text,
                        content_image_url=content_image_url
                    )

                    if saved_message:
                        await manager.send_to_client(
                            {"type": "message", "payload": saved_message.model_dump(mode='json')},
                            conversation_id,
                            'pharmacist'
                        )
                    else:
                        logger.error(f"Failed to save message from guest {session_id} in conv {conversation_id}")
                except Exception as process_error:
                    logger.error(f"Error processing/sending message from guest {session_id}: {process_error}", exc_info=True)


    except WebSocketDisconnect:
        logger.info(f"Guest {session_id} disconnected (WebSocketDisconnect caught outside loop) from conversation {conversation_id}")
        try:
             if manager.is_client_connected(conversation_id, 'pharmacist'):
                 await manager.send_to_client(
                     {"type": "guest_left", "payload": None},
                     conversation_id,
                     'pharmacist'
                 )
             else:
                  logger.info(f"Pharmacist not connected to {conversation_id}, skipping guest_left notification.")
        except Exception as notify_error:
             logger.error(f"Error notifying pharmacist about guest left in {conversation_id}: {notify_error}")


    except WebSocketException as e:
        logger.error(f"WebSocketException for guest {session_id} in conv {conversation_id}: {e.code} - {e.reason}")

    except Exception as e:
        logger.error(f"Unexpected error for guest {session_id} in conv {conversation_id}: {e}", exc_info=True)

    finally:
        logger.info(f"Guest endpoint finally block: Disconnecting guest {session_id} from conversation {conversation_id}")
        manager.disconnect(websocket, conversation_id)



@router.get(
    "/pharmacist/conversations/waiting",
    response_model=response.BaseResponse,
)
async def get_waiting_conversations():
    try:
        waiting_conversations = await chat_box.get_waiting_conversations()

        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            status="success",
            message="Waiting conversations fetched successfully",
            data=waiting_conversations
        )
    except Exception as e:
        logger.error(f"Error fetching waiting conversations: {e}", exc_info=True)
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            status="error",
            message="Internal server error",
            data=None
        )


@router.websocket("/pharmacist/chat/{conversation_id}")
async def pharmacist_websocket_endpoint(
    websocket: WebSocket,
    conversation_id: str,
    token= "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Nzc4OTI1NjYsInVzZXJuYW1lIjoiNjgxNmU2OTk2OGZlMDI3ODUxZjAyM2QzIiwicm9sZV9pZCI6InBoYXJtYWNpc3QiLCJkZXZpY2VfaWQiOiJzdHJpbmcifQ.R2ixQOBaYsmlX5CBvavXJ-yVBLyGPCAmLdYCmIeixB1slLF7v4nsT5tGuDUjDdZWlVLVv4ZTAtBO01INlzwL2tdXf-XYodllIMRJuzhQWFaS6dV0NyVgRccrRLL3YteSsnA5TfO_6bEUxyPMXkF_JZ6vVKtshfCpRlL-9VT8ekY"
):
    pharmacist_cur = await  pharmacist.get_current(token=token)

    conversation = await chat_box.get_conversation_by_id(conversation_id)

    if not conversation:
        logger.warn(f"Pharmacist {pharmacist_cur.id}: Conversation {conversation_id} not found.")
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION) # Hoặc mã lỗi khác
        return

    if conversation.status == CLOSED:
        logger.warn(f"Pharmacist {pharmacist_cur.id}: Attempted to join closed conversation {conversation_id}.")
        await websocket.close(code=status.WS_1000_NORMAL_CLOSURE) # Hoặc mã lỗi khác
        return

    guest_identifier = conversation.participant_1_ref.id
    if not guest_identifier:
         logger.error(f"Conversation {conversation_id} has no user or guest identifier!")
         await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
         return

    accept_connection = False
    if conversation.status == WAITING:
        logger.info(f"Pharmacist {pharmacist_cur.id} joining WAITING conversation {conversation_id}.")
        updated = await chat_box.assign_pharmacist_to_conversation(
            conversation_id=conversation_id,
            pharmacist_id=pharmacist_cur.id,
            pharmacist_name=pharmacist_cur.user_name,
        )
        if updated:
            logger.info(f"Conversation {conversation_id} status changed to ACTIVE, assigned to pharmacist {pharmacist_cur.id}.")
            # await manager.broadcast_to_conversation(
            #     conversation_id,
            #     {"type": "system", "payload": f"Dược sĩ {pharmacist_cur.user_name or pharmacist_cur.id} đã tham gia."}, # Sử dụng tên nếu có
            #     # exclude_ws=None # Gửi cho cả guest/user
            # )

            message_to_broadcast = {"type": "system",
                                    "payload": f"Dược sĩ {pharmacist_cur.user_name or pharmacist_cur.id} đã tham gia."}
            await manager.broadcast_to_conversation(
                message_to_broadcast,
                conversation_id
            )
            accept_connection = True
        else:
            logger.error(f"Failed to update conversation {conversation_id} status or assign pharmacist.")
            await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
            return

    elif conversation.status == ACTIVE:
        # Kiểm tra xem có đúng pharmacist được gán đang kết nối lại không
        if conversation.pharmacist_ref.id == pharmacist_cur.id:
            logger.info(f"Pharmacist {pharmacist_cur.id} RECONNECTING to ACTIVE conversation {conversation_id}.")
            accept_connection = True
        else:
            logger.warn(f"Pharmacist {pharmacist_cur.id} attempted to join ACTIVE conversation {conversation_id} assigned to {conversation.pharmacist_ref.id}.")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION) # Không được phép
            return

    # 4. Nếu được phép, chấp nhận kết nối và vào vòng lặp chat
    if accept_connection:
        await manager.connect(websocket, conversation_id, "pharmacist")
        try:
            # Gửi lịch sử chat (nếu có)
            history = await chat_box.get_messages_for_conversation(conversation_id)
            await websocket.send_json({
                "type": "history",
                "payload": [msg.dict() for msg in history] # Chuyển message thành dict
            })

            while True:
                data = await websocket.receive_json()
                logger.info(f"Pharmacist {pharmacist_cur.id} in {conversation_id} sent: {data}")
                logger.info(f"1111")

                if data.get("type") == "message":
                    logger.info(f"3333")
                    saved_message = await chat_box.save_message(  # Lấy message đã lưu nếu cần ID
                        conversation_id=conversation_id,
                        sender_id=pharmacist_cur.id,
                        sender_type="pharmacist",
                        content_text=data["payload"].get("text"),  # Dùng .get() an toàn hơn
                        # Thêm xử lý content_image_url nếu có
                    )
                    if not saved_message:
                        logger.error(f"Failed to save message from pharmacist {pharmacist_cur.id} in {conversation_id}")
                        # Cân nhắc gửi lại lỗi cho client?

                    # Broadcast cho client kia (guest/user)
                    # Nên gửi message đã lưu (có timestamp, id từ DB) thay vì data gốc
                    message_to_broadcast = {
                        "type": "message",
                        # Bao gồm các thông tin cần thiết cho client nhận
                        "payload": {
                            "id": str(saved_message.id) if saved_message else None,  # Chuyển ObjectId thành str
                            "sender": {"id": pharmacist_cur.id, "type": "pharmacist"},
                            "content": saved_message.content.model_dump() if saved_message else data["payload"],
                            # Gửi content đã lưu
                            "timestamp": saved_message.timestamp.isoformat() if saved_message else datetime.utcnow().isoformat()
                        }
                    }
                    # Gọi hàm broadcast (đảm bảo đúng thứ tự tham số)
                    await manager.broadcast_to_conversation(
                        message=message_to_broadcast,  # message là tham số đầu tiên
                        conversation_id=conversation_id,
                        exclude_sender=websocket  # Loại trừ người gửi
                    )
                     # Lưu message vào DB
                     # await chat_box.save_message(
                     #     conversation_id=conversation_id,
                     #     sender_id=pharmacist_cur.id,
                     #     sender_type="pharmacist",
                     #     content_text=data["payload"]["text"]
                     # )
                     # # Broadcast cho client kia
                     # await manager.broadcast_to_conversation(
                     #     conversation_id,
                     #     {"type": "message", "sender": "pharmacist", "payload": data["payload"]},
                     #     exclude_ws=websocket
                     # )
                else:
                    logger.warn(
                        f"Pharmacist {pharmacist_cur.id} in {conversation_id} sent unknown data format: {data}")
                    # Có thể gửi lại lỗi cho client nếu cần


        except WebSocketDisconnect:
            logger.info(f"Pharmacist {pharmacist_cur.id} disconnected from conversation {conversation_id}.")
            manager.disconnect(websocket, conversation_id)
            # Cân nhắc: Có nên thông báo cho guest/user? Có nên đổi status conversation?
            # await manager.broadcast_to_conversation(
            #     conversation_id,
            #     {"type": "system", "payload": "Dược sĩ đã ngắt kết nối."},
            #     exclude_ws=websocket
            # )
            # await crud_conversation.update_conversation_status(conversation_id, ConversationStatus.WAITING) # Ví dụ: quay lại chờ
        except Exception as e:
            logger.error(f"Pharmacist WS Error in conv {conversation_id}: {e}", exc_info=True)
            manager.disconnect(websocket, conversation_id)
            await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
    else:
         # Trường hợp không rõ ràng, đóng kết nối
         logger.warn(f"Pharmacist {pharmacist_cur.id} connection to {conversation_id} not accepted for unknown reason.")
         await websocket.close(code=status.WS_1011_INTERNAL_ERROR)
