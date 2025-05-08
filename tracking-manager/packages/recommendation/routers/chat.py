from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel, validator
from typing import Optional, Literal # Thêm Literal để validate type
from services import chatbot as chatbot_service

router = APIRouter()

# Model cho request body mới
class ChatQueryRequest(BaseModel):
    query: str
    type: Literal['guest', 'user'] # type phải là 'guest' hoặc 'user'
    name: Optional[str] = None

    @validator('name', always=True)
    def check_name_for_user_type(cls, v, values):
        # Nếu type là 'user', name không nên là None hoặc rỗng (tùy yêu cầu)
        # Ở đây, chúng ta cho phép name là None/rỗng và sẽ fallback trong service
        # Nếu bạn muốn bắt buộc name khi type='user', bạn có thể thêm logic ở đây
        # if values.get('type') == 'user' and not v:
        #     raise ValueError("Name is required when type is 'user'")
        if values.get('type') == 'guest' and v:
            # Nếu là guest thì không nên có name, hoặc bỏ qua name
            # Ở đây ta chọn bỏ qua, service sẽ không dùng name của guest
            pass
        return v

class ChatResponse(BaseModel):
    answer: str
    session_id: str

@router.post("/chatbot/{session_id}", response_model=ChatResponse)
async def chat_with_session_endpoint(
    chat_request: ChatQueryRequest,
    session_id: str = Path(..., min_length=1, description="The unique session identifier provided by the client.")
):
    try:
        user_id_for_log = f"{chat_request.type}_{chat_request.name or session_id}"

        answer_content = await chatbot_service.handle_user_query(
            user_query=chat_request.query,
            session_id=session_id,
            user_id=user_id_for_log, # user_id cho log có thể bao gồm type và name
            user_type=chat_request.type,
            user_name=chat_request.name
        )
        return ChatResponse(answer=answer_content, session_id=session_id)
    except ValueError as ve: # Bắt lỗi validation từ Pydantic model nếu có
        raise HTTPException(status_code=422, detail=str(ve))
    except Exception as e:
        import traceback
        print(f"Error in /chatbot/{session_id} endpoint: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"An internal server error occurred: {str(e)}")
