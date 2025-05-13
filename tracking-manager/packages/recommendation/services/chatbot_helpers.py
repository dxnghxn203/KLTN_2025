# services/chatbot_helpers.py
import os
import json
from datetime import datetime
import requests
from dotenv import load_dotenv
from langchain_core.messages import SystemMessage, HumanMessage

from core import logger
from core.redis import redis_client
import redis


load_dotenv()

CURRENT_DIR_HELPERS = os.path.dirname(os.path.abspath(__file__))
STATICS_DIR_HELPERS = os.path.join(os.path.dirname(CURRENT_DIR_HELPERS), "statics")
TRACKING_API_URL= os.getenv("TRACKING_API_URL")

print(f"DEBUG (helpers): Calculated STATICS_DIR: {STATICS_DIR_HELPERS}")


def load_prompt_templates():
    template_file_path = os.path.join(STATICS_DIR_HELPERS, "prompt_templates.json")
    try:
        with open(template_file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError:
        return {}


templates_helpers = load_prompt_templates()


def load_phrases_from_json(filename: str) -> list[str]:
    file_path = os.path.join(STATICS_DIR_HELPERS, filename)
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            phrases = json.load(f)
            if not isinstance(phrases, list): return []
            phrases = [str(p).strip().lower() for p in phrases if isinstance(p, (str, int, float)) and str(p).strip()]
            return sorted(list(set(phrases)), key=len, reverse=True)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []


GENERAL_QUESTION_PHRASES_HELPERS = load_phrases_from_json("general_question_phrases.json")

SESSION_CONTEXT_TTL_SECONDS = 1800


def get_session_context(session_id: str) -> dict:
    default_context = {
        "user_id": None,
        "user_name": "bạn",
        "user_email": None,
        "access_token": None,
        "is_registered_user": False,
        "current_cart": [],
        "recently_mentioned_products": [],
        "last_explicit_product": None,
        "disambiguation_options": None,
        "pending_action": None,
        "last_interaction_time": None
    }
    if not redis_client:
        print("WARNING (helpers): Redis client not available.")
        return default_context.copy()

    context_key = f"chatbot_session_context:{session_id}"
    try:
        context_json_string = redis_client.get(context_key)
        if context_json_string:
            context_data = json.loads(context_json_string)
            for key, value in default_context.items():
                context_data.setdefault(key, value)
            return context_data
    except redis.exceptions.RedisError as re_err:
        print(f"ERROR (helpers): Redis error getting context for {context_key}: {re_err}")
    except json.JSONDecodeError as je:
        print(f"ERROR (helpers): JSON decode error for {context_key}: {je}.")
    except Exception as e:  # Bắt lỗi chung hơn
        print(f"ERROR (helpers): Unexpected error getting context for {context_key}: {e}")

    return default_context.copy()

def log_conversation_turn(mongo_collection, session_id: str, user_id: str | None, user_query: str, bot_response: str,
                          is_registered_user: bool, user_name_for_log: str | None,
                          llm_model: str | None = "gpt-4o-mini", intent: str | None = None,
                          entities: dict | None = None, current_context: dict | None = None):
    log_entry = {
        "session_id": session_id, "user_db_id": user_id, "is_registered_user": is_registered_user,
        "user_name_provided": user_name_for_log, "timestamp": datetime.utcnow(),
        "user_query": user_query, "bot_response": bot_response, "llm_model_used": llm_model,
        "identified_intent": intent, "entities_extracted": entities, "context_at_turn": current_context
    }
    try:
        if mongo_collection:
            mongo_collection.insert_one(log_entry)
        else:
            print("WARNING (helpers): MongoDB collection not provided for logging.")
    except Exception as e:
        print(f"ERROR (helpers): Failed to log to MongoDB: {e}")



def format_product_for_prompt(product_data_raw: dict | None) -> dict:
    if not product_data_raw or not isinstance(product_data_raw, dict):
        return {
            "product_name": "N/A", "description": "Không có thông tin.", "uses": "Không có thông tin.",
            "ingredients": "Không có thông tin.", "dosage": "Không có thông tin.",
            "side_effects": "Không có thông tin.", "precautions": "Không có thông tin.",
            "prices_formatted": "Chưa có thông tin giá.", "inventory": "Không rõ",
            "raw_product_id_api": "N/A", "raw_prices_api": []
        }

    prices_list = product_data_raw.get("prices", [])  # prices là list các dict giá
    prices_formatted_parts = []
    processed_prices_for_api = []

    if prices_list and isinstance(prices_list, list):
        for i, price_item_raw in enumerate(prices_list):
            if not isinstance(price_item_raw, dict): continue
            try:
                unit = price_item_raw.get("unit", "Đơn vị")
                price_val = price_item_raw.get("price")
                price_id_for_api_cart = price_item_raw.get("price_id_api")  # Hoặc tên field đúng của bạn
                if not price_id_for_api_cart:  # Tạo ID giả nếu không có, nhưng không khuyến khích cho production
                    price_id_for_api_cart = f"price_{str(product_data_raw.get('_id'))}_{i + 1}"
                    print(
                        f"WARNING (helpers): Missing 'price_id_api' for price item {price_item_raw}. Generated: {price_id_for_api_cart}")

                price_str = f"{price_val:,.0f}đ" if isinstance(price_val, (int, float)) else "N/A"
                price_part_display = f"{unit}: {price_str} (Lựa chọn {i + 1})"
                prices_formatted_parts.append(price_part_display)

                processed_prices_for_api.append({
                    "unit": unit,
                    "price": price_val,
                    "price_id_api": price_id_for_api_cart  # Quan trọng cho việc gọi API giỏ hàng
                })
            except (TypeError, ValueError) as e:
                print(f"DEBUG (helpers): Error formatting price_item {price_item_raw}: {e}")

    prices_formatted_str = "\n".join(prices_formatted_parts) if prices_formatted_parts else "Chưa có thông tin giá."
    if len(prices_formatted_parts) > 1:
        prices_formatted_str = "Hiện có các mức giá sau (vui lòng chọn theo số thứ tự):\n" + prices_formatted_str

    return {
        "product_name": str(product_data_raw.get("name_primary", "N/A")),
        "description": str(product_data_raw.get("description", "Không có thông tin.")),
        "uses": str(product_data_raw.get("uses", "Không có thông tin.")),
        "ingredients": ", ".join([f"{ing.get('ingredient_name', 'N/A')}" for ing in
                                  product_data_raw.get("ingredients", [])]) or "Không có thông tin.",
        "dosage": str(product_data_raw.get("dosage", "Không có thông tin.")),
        "side_effects": str(product_data_raw.get("side_effects", "Không có thông tin.")),
        "precautions": str(product_data_raw.get("precautions", "Không có thông tin.")),
        "prices_formatted": prices_formatted_str,
        "inventory": str(product_data_raw.get("inventory", "Không rõ")),
        "raw_product_id_api": str(product_data_raw.get("_id", "N/A")),  # ID sản phẩm cho API
        "raw_prices_api": processed_prices_for_api  # Danh sách các giá đã xử lý, chứa price_id_api
    }


def product_data_formatted_to_str(product_data_formatted: dict) -> str:
    if not product_data_formatted or product_data_formatted.get("product_name") == "N/A":
        return "Không có thông tin chi tiết về sản phẩm này."
    parts = [
        f"- Mô tả: {product_data_formatted.get('description', 'Không có thông tin.')}",
        f"- Công dụng: {product_data_formatted.get('uses', 'Không có thông tin.')}",
        f"- Thành phần: {product_data_formatted.get('ingredients', 'Không có thông tin.')}",
        f"- Liều dùng: {product_data_formatted.get('dosage', 'Không có thông tin.')}",
        f"- Tác dụng phụ: {product_data_formatted.get('side_effects', 'Không có thông tin.')}",
        f"- Lưu ý: {product_data_formatted.get('precautions', 'Không có thông tin.')}",
        f"- Giá: \n{product_data_formatted.get('prices_formatted', 'Chưa có thông tin giá.')}",
        f"- Tồn kho: {product_data_formatted.get('inventory', 'Không rõ')}"
    ]
    return "\n".join(filter(None, parts))


def format_multiple_products_for_prompt(products_list_raw: list, for_disambiguation=False):
    if not products_list_raw: return "Không tìm thấy sản phẩm nào."
    info_str = ""
    for i, p_data_raw in enumerate(products_list_raw):
        if not isinstance(p_data_raw, dict): continue
        p_name = str(p_data_raw.get("name_primary", "Sản phẩm không rõ tên"))
        if for_disambiguation:
            info_str += f"{i + 1}. {p_name}\n"
        else:
            info_str += f"{i + 1}. {p_name}\n"
    return info_str.strip()


def extract_product_search_term(query: str) -> str:
    print(f"\nDEBUG extract_term (helpers): --- Query: '{query}' ---")
    processed_query = query.lower().strip()
    final_term = processed_query  # Placeholder, dán logic đầy đủ của bạn vào đây
    for phrase in GENERAL_QUESTION_PHRASES_HELPERS:
        if final_term.startswith(phrase + " "):
            final_term = final_term[len(phrase) + 1:].strip()
        elif final_term.endswith(" " + phrase):
            final_term = final_term[:-len(phrase) - 1].strip()
        elif final_term == phrase:
            final_term = ""
            break
    if final_term and final_term[-1] in ['?', '.', '!', ',']: final_term = final_term[:-1].strip()
    print(f"DEBUG extract_term (helpers): === Final Term: '{final_term}' ===")
    return final_term


def get_user_by_token(auth_token_header: str | None) -> dict | None:
    if not auth_token_header or not auth_token_header.startswith("Bearer "):
        return None
    token = auth_token_header.split(" ")[1]
    if token == "VALID_TOKEN_FOR_DXNGHXN203_TEST":
        return {
            "id": "user_dxnghxn203_mongodb_id",
            "name": "dxnghxn203",
            "email": "dxnghxn203@example.com",
            "access_token_for_cart_api": token
        }
    print(f"DEBUG (helpers): get_user_by_token: Token '{token[:10]}...' (placeholder check failed).")
    return None

def view_cart(user_access_token: str):
    view_cart_api = f"{TRACKING_API_URL}/v1/cart/"
    headers = {"accept": "application/json", "Authorization": f"Bearer {user_access_token}"}
    try:
        response = requests.get(view_cart_api, headers=headers)
        logger.info(response.content)
        if 200 <= response.status_code < 300:
            print(f"INFO (helpers): View cart via API. Status: {response.status_code}, Resp: {response.text[:100]}")
            return  json.loads(response.content.decode('utf-8'))
        else:
            print(f"ERROR (helpers): View API failed. Status: {response.status_code}, Body: {response.text}")
            return None
    except requests.RequestException as e:
        print(f"ERROR (helpers): Request to Cart API failed: {e}")
        return None


def add_to_cart_api(product_id_api: str, price_id_api: str, quantity: int, user_access_token: str) -> bool:
    cart_api_url = f"${TRACKING_API_URL}/v1/cart/"
    params = {"product_id": product_id_api, "price_id": price_id_api, "quantity": str(quantity)}
    headers = {"accept": "application/json", "Authorization": f"Bearer {user_access_token}"}
    try:
        print(
            f"DEBUG (helpers): Calling Add to Cart API: URL='{cart_api_url}', Params='{params}', Token='{user_access_token[:10]}...'")
        response = requests.post(cart_api_url, headers=headers, params=params)  # API của bạn dùng query params
        if 200 <= response.status_code < 300:
            print(f"INFO (helpers): Added to cart via API. Status: {response.status_code}, Resp: {response.text[:100]}")
            return True
        else:
            print(f"ERROR (helpers): Add to Cart API failed. Status: {response.status_code}, Body: {response.text}")
            return False
    except requests.RequestException as e:
        print(f"ERROR (helpers): Request to Cart API failed: {e}")
        return False


async def get_llm_chat_response(llm_instance, system_prompt_content: str, user_prompt_content: str) -> str:
    try:
        messages = [SystemMessage(content=system_prompt_content), HumanMessage(content=user_prompt_content)]
        llm_response_object = await llm_instance.ainvoke(messages)
        return llm_response_object.content.strip()
    except Exception as e:
        print(f"ERROR llm_service (helpers): Error calling LLM: {e}")
        return "Xin lỗi, tôi đang gặp chút sự cố, vui lòng thử lại sau."

BASE_SYSTEM_PERSONA_HELPERS = "Bạn là một dược sĩ AI tại Việt Nam, rất am hiểu về các sản phẩm thuốc và thực phẩm chức năng. Hãy luôn xưng hô với người dùng là '{anrede}' một cách thân thiện, nhẹ nhàng và dễ hiểu."
PRODUCT_NOT_FOUND_MESSAGE_HELPERS = "Chào {anrede}! Rất tiếc là mình không tìm thấy thông tin về sản phẩm bạn tìm kiếm..."


