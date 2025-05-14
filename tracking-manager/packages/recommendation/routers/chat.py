import uuid
from fastapi import APIRouter, Body
from starlette import status
from pydantic import BaseModel

from core import logger as app_logger
from core import response
from services import chatbot

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    session_id: str


class StartConversationResponseData(BaseModel):
    session_id: str

@router.post("/conversation/start", response_model=response.BaseResponse)
async def start_conversation_endpoint():
    try:
        new_session_id = str(uuid.uuid4())
        app_logger.info(f"New conversation started. Session ID created: {new_session_id}")

        return response.BaseResponse(
            message="New conversation session started successfully.",
            data=StartConversationResponseData(session_id=new_session_id)
        )
    except Exception as e:
        app_logger.error(f"Error starting new conversation: {e}", exc_info=True)
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error while starting new conversation."
        )


@router.post("/message", response_model=response.BaseResponse)
async def chat_message_endpoint(chat_request: ChatRequest = Body(...)):
    try:
        app_logger.info(
            f"Received chat request for session_id: {chat_request.session_id}, question: '{chat_request.question}'")

        ai_answer = chatbot.generate_response(
            session_id=chat_request.session_id,
            user_input=chat_request.question
        )

        app_logger.info(f"AI response for session_id {chat_request.session_id}: '{ai_answer}'")

        return response.BaseResponse(
            message="AI response successfully generated.",
            data={"ai_answer": ai_answer}
        )
    except Exception as e:
        app_logger.error(f"Error processing chat message for session_id {chat_request.session_id}: {e}", exc_info=True)
        return response.BaseResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error while processing chat message."
        )