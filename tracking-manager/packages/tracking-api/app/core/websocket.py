import asyncio

from bson import ObjectId
from fastapi import WebSocket
from typing import Dict, Optional, Literal, Any, Annotated
from app.core import logger

from pydantic import BeforeValidator

PyObjectId = Annotated[
    ObjectId,
    BeforeValidator(lambda v: ObjectId(v) if ObjectId.is_valid(v) else v)
]

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[PyObjectId, Dict[str, Optional[WebSocket]]] = {}

    async def connect(self, websocket: WebSocket, conversation_id: PyObjectId, client_type: Literal['guest', 'pharmacist']):
        await websocket.accept()
        if conversation_id not in self.active_connections:
            self.active_connections[conversation_id] = {"guest": None, "pharmacist": None}

        existing_socket = self.active_connections[conversation_id].get(client_type)
        if existing_socket and existing_socket != websocket:
            logger.warn(f"Duplicate {client_type} connection for conv {conversation_id}. Closing old one.")
            try:
                await existing_socket.close(code=1008, reason="New connection established by same client type")
            except Exception:
                pass

        self.active_connections[conversation_id][client_type] = websocket
        logger.info(f"{client_type.capitalize()} connected to conversation {conversation_id}")

    def disconnect(self, websocket: WebSocket, conversation_id: PyObjectId):
        disconnected_type = None
        if conversation_id in self.active_connections:
            if self.active_connections[conversation_id]["guest"] == websocket:
                self.active_connections[conversation_id]["guest"] = None
                disconnected_type = "guest"
            elif self.active_connections[conversation_id]["pharmacist"] == websocket:
                self.active_connections[conversation_id]["pharmacist"] = None
                disconnected_type = "pharmacist"

            if disconnected_type:
                logger.info(f"{disconnected_type.capitalize()} disconnected from conversation {conversation_id}")

            # Dọn dẹp nếu phòng trống
            if not self.active_connections[conversation_id]["guest"] and not self.active_connections[conversation_id]["pharmacist"]:
                logger.info(f"Conversation {conversation_id} is empty. Removing from manager.")
                del self.active_connections[conversation_id]

        return disconnected_type

    async def send_to_client(self, message: Dict[str, Any], conversation_id: PyObjectId, target_client_type: Literal['guest', 'pharmacist']):
        if conversation_id in self.active_connections:
            target_socket = self.active_connections[conversation_id].get(target_client_type)
            if target_socket:
                try:
                    await target_socket.send_json(message)
                    return True
                except Exception as e:
                    logger.error(f"Failed to send message to {target_client_type} in conv {conversation_id}: {e}")
                    return False
            else:
                logger.warn(f"Cannot send message: {target_client_type} not connected in conv {conversation_id}")
                return False
        else:
            logger.warn(f"Cannot send message: Conversation {conversation_id} not found in manager.")
            return False

    async def broadcast_to_conversation(self, message: Dict[str, Any], conversation_id: PyObjectId, exclude_sender: Optional[WebSocket] = None):
        if conversation_id in self.active_connections:
            guest_ws = self.active_connections[conversation_id].get("guest")
            pharmacist_ws = self.active_connections[conversation_id].get("pharmacist")
            tasks = []
            if guest_ws and guest_ws != exclude_sender:
                tasks.append(self._safe_send(guest_ws, message))
            if pharmacist_ws and pharmacist_ws != exclude_sender:
                tasks.append(self._safe_send(pharmacist_ws, message))

            if tasks:
                await asyncio.gather(*tasks)

    async def _safe_send(self, websocket: WebSocket, message: Dict[str, Any]):
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.warn(f"Error sending message via safe_send: {e}. Client might have disconnected.")

manager = ConnectionManager()