from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from services import chatbot as chatbot_service
from models import product as product_model  # Cho endpoint lấy tồn kho trực tiếp

router = APIRouter()


class ChatQuery(BaseModel):
    query: str


class ChatResponse(BaseModel):
    answer: str


@router.post("/chat", response_model=ChatResponse)
async def handle_chat(chat_query: ChatQuery = Body(...)):
    """
    Endpoint chính để người dùng tương tác với chatbot.
    """
    if not chat_query.query:
        raise HTTPException(status_code=400, detail="Query không được để trống.")
    try:
        answer = await chatbot_service.handle_user_query(chat_query.query)
        return ChatResponse(answer=answer)
    except Exception as e:
        # Log lỗi ở đây (e)
        print(f"Error in /chat endpoint: {e}")  # In ra console cho debug
        raise HTTPException(status_code=500, detail="Đã có lỗi xảy ra trong quá trình xử lý yêu cầu của bạn.")


# Endpoint ví dụ để kiểm tra tồn kho trực tiếp (không qua LLM)
class StockResponse(BaseModel):
    product_name: str
    inventory: int | str


@router.get("/products/{product_name_or_id}/stock", response_model=StockResponse)
async def get_stock_info(product_name_or_id: str):
    """
    Lấy thông tin tồn kho của một sản phẩm theo tên hoặc ID (product_id từ schema của bạn, hoặc _id của MongoDB).
    """
    inventory = product_model.get_product_inventory(product_name_or_id)

    if inventory is None:
        raise HTTPException(status_code=404,
                            detail=f"Không tìm thấy sản phẩm hoặc thông tin tồn kho cho '{product_name_or_id}'.")

    # Lấy lại tên sản phẩm cho đẹp
    product_data = product_model.get_product_by_id(product_name_or_id)
    if not product_data:
        product_data = product_model.get_product_by_name(product_name_or_id)

    product_name = product_data.get("name_primary", product_name_or_id) if product_data else product_name_or_id

    return StockResponse(product_name=product_name, inventory=inventory)
