from app.core.database import db
from app.entities.chat_box.request import Conversation, Message

from pydantic import BeforeValidator
from typing import Annotated
from bson import ObjectId

conversation_collection_name ='conversations'
message_collection_name = 'messages'

conversation_collection = db[conversation_collection_name]
message_collection = db[message_collection_name]

WAITING = "waiting"
ACTIVE = "active"
CLOSED = "closed"

PyObjectId = Annotated[
    ObjectId,
    BeforeValidator(lambda v: ObjectId(v) if ObjectId.is_valid(v) else v)
]

import logging
from datetime import datetime
from typing import List, Optional, Literal

from bson import ObjectId
from pymongo import ReturnDocument # Để lấy document sau khi update

logger = logging.getLogger(__name__)

async def get_or_create_conversation(
    participant_id: str,
    participant_type: Literal['guest', 'user']
) -> Conversation:
    participant_ref_data = {"id": participant_id, "type": participant_type}
    current_time = datetime.utcnow()

    existing_conversation = conversation_collection.find_one(
        {"participant_1_ref": participant_ref_data, "status": {"$in": ["active", "waiting"]}}
    )

    if existing_conversation:
        logger.info(f"Found existing conversation {existing_conversation['_id']} for {participant_type} {participant_id}")
        updated_doc = conversation_collection.find_one_and_update(
            {"_id": existing_conversation["_id"]},
            {"$set": {"last_message_at": current_time}},
            return_document=ReturnDocument.AFTER
        )
        if updated_doc:
            return Conversation(**updated_doc)
        else:
            logger.error(f"Failed to update last_message_at for conversation {existing_conversation['_id']}")
            return Conversation(**existing_conversation)

    else:
        logger.info(f"Creating new conversation for {participant_type} {participant_id}")
        new_conversation_data = {
            "participant_1_ref": participant_ref_data,
            "pharmacist_ref": None,
            "status": "waiting",
            "created_at": current_time,
            "pharmacist_joined_at": None,
            "last_message_at": current_time, # Quan trọng cho TTL ngay từ đầu
            "closed_at": None
        }
        conversation_model = Conversation(**new_conversation_data)
        insert_data = conversation_model.model_dump(exclude={"id"}, by_alias=True) # by_alias=True nếu dùng alias _id

        result = conversation_collection.insert_one(insert_data)
        created_doc = conversation_collection.find_one({"_id": result.inserted_id})
        if created_doc:
            return Conversation(**created_doc)
        else:
            logger.error("Failed to retrieve newly created conversation.")
            raise Exception("Failed to create and retrieve conversation")


async def assign_pharmacist_to_conversation(
    conversation_id: PyObjectId,
    pharmacist_id: str,
    pharmacist_name: str
) -> Optional[Conversation]:
    current_time = datetime.utcnow()
    pharmacist_ref_data = {"id": pharmacist_id, "name": pharmacist_name}

    updated_doc = conversation_collection.find_one_and_update(
        {
            "_id": ObjectId(conversation_id) ,
            "status": "waiting"
        },
        {
            "$set": {
                "pharmacist_ref": pharmacist_ref_data,
                "status": "active",
                "pharmacist_joined_at": current_time,
                "last_message_at": current_time
            }
        },
        return_document=ReturnDocument.AFTER
    )

    if updated_doc:
        logger.info(f"Pharmacist {pharmacist_id} assigned to conversation {conversation_id}")
        return Conversation(**updated_doc)
    else:
        logger.warning(f"Conversation {conversation_id} not found or not in 'waiting' state for pharmacist assignment.")
        return None

async def get_waiting_conversations(limit: int = 20) -> List[Conversation]:
    conversations_cursor = conversation_collection.find(
        {"status": "waiting"}
    ).sort("created_at", 1).limit(limit)
    conversations = conversations_cursor.to_list(length=limit)
    return [Conversation(**conv) for conv in conversations]

async def close_conversation(conversation_id: PyObjectId) -> bool:
    current_time = datetime.utcnow()
    result = conversation_collection.update_one(
        {"_id": conversation_id, "status": {"$ne": "closed"}},
        {
            "$set": {
                "status": "closed",
                "closed_at": current_time,
                "last_message_at": current_time
            }
        }
    )
    if result.modified_count == 1:
        logger.info(f"Conversation {conversation_id} closed.")
        return True
    else:
        logger.warning(f"Conversation {conversation_id} not found or already closed.")
        return False

async def get_conversation_by_id(conversation_id: str) -> Optional[Conversation]:
    conv_doc = conversation_collection.find_one({"_id": ObjectId(conversation_id)})
    if conv_doc:
        return Conversation(**conv_doc)
    return None

async def save_message(
    conversation_id: PyObjectId,
    sender_id: str,
    sender_type: Literal['guest', 'user', 'pharmacist'],
    content_text: Optional[str] = None,
    content_image_url: Optional[str] = None
) -> Optional[Message]:
    current_time = datetime.utcnow()

    message_data = {
        "conversation_id": conversation_id,
        "sender": {"id": sender_id, "type": sender_type},
        "content": {"text": content_text, "image_url": content_image_url},
        "timestamp": current_time
    }
    try:
        message_model = Message(**message_data)
        insert_data = message_model.model_dump(exclude={"id"}, by_alias=True) # by_alias nếu dùng alias _id
    except Exception as e:
        logger.error(f"Message validation error: {e}")
        return None

    try:
        result = await message_collection.insert_one(insert_data)
        message_id = result.inserted_id
        logger.info(f"Message {message_id} saved for conversation {conversation_id}")
    except Exception as e:
        logger.error(f"Failed to save message for conversation {conversation_id}: {e}")
        return None

    try:
        conv_update_result = conversation_collection.update_one(
            {"_id": conversation_id},
            {"$set": {"last_message_at": current_time}}
        )
        if conv_update_result.matched_count == 0:
            logger.warning(f"Conversation {conversation_id} not found when updating last_message_at after saving message {message_id}.")
        elif conv_update_result.modified_count == 0:
             logger.info(f"last_message_at already up-to-date for conversation {conversation_id}.")


    except Exception as e:
        logger.error(f"Failed to update last_message_at for conversation {conversation_id}: {e}")

    created_message_doc = await message_collection.find_one({"_id": message_id})
    if created_message_doc:
        return Message(**created_message_doc)
    else:
        logger.error(f"Failed to retrieve newly saved message {message_id}")
        return None


async def get_messages_for_conversation(
    conversation_id: PyObjectId,
    limit: int = 100
) -> List[Message]:
    messages_cursor = message_collection.find(
        {"conversation_id": conversation_id}
    ).sort("timestamp", 1).limit(limit)
    messages = messages_cursor.to_list(length=limit)
    return [Message(**msg) for msg in messages]
