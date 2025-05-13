# services/chatbot_service.py
# ... (các import và khởi tạo LLM, MongoDB collection như cũ) ...
from . import chatbot_helpers as helpers
from . import intent_handlers
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from datetime import datetime

from .chatbot import save_session_context

load_dotenv()

llm_instance = ChatOpenAI(
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    model_name=os.getenv("LLM_MODEL_NAME", "gpt-4o-mini"),  # Giả sử có model_name
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1"),
    temperature=0.5
)

# Giả sử mongo_db_main_app được import và khởi tạo đúng cách từ core.mongo
try:
    from core.mongo import db as mongo_db_main_app
    conversation_log_collection_service = mongo_db_main_app['conversation_logs']
except ImportError:
    mongo_db_main_app = None
    conversation_log_collection_service = None
    print(
        "WARNING (service init): Could not import mongo_db_main_app from core.mongo. Logging to MongoDB will be disabled.")


async def detect_intent_and_entities(query: str, llm_instance_for_nlu) -> tuple[str | None, dict]:
    query_lower = query.lower().strip()
    if any(kw in query_lower for kw in ["thêm vào giỏ", "cho vào giỏ", "add to cart"]):
        return "ADD_TO_CART", {}
    if any(kw in query_lower for kw in ["xem giỏ hàng", "giỏ hàng của tôi"]):
        return "VIEW_CART", {}
    if any(kw in query_lower for kw in ["chào", "hello", "xin chào", "hi", "chào shop nha"]):
        return "GREETING", {}
    return "PRODUCT_QUERY_OR_GENERAL", {}


async def handle_user_query(
        session_id: str,
        user_query: str
):
    bot_response_content = None
    current_context = helpers.get_session_context(session_id)

    user_db_id = current_context.get("user_id")
    user_name_for_greeting = current_context.get("user_name", "bạn")
    access_token_for_cart_api = current_context.get("access_token")
    is_registered_user = bool(current_context.get("is_registered_user", False))

    if session_id.startswith("user_") and not is_registered_user:
        print(
            f"WARNING (Service): Session ID '{session_id}' looks like a user ID, but context is not marked as registered user or lacks info. User may need to re-initialize session via /init endpoint.")

    if is_registered_user:
        if not user_db_id or not access_token_for_cart_api:
            print(
                f"CRITICAL ERROR (Service): Registered user context for session '{session_id}' is missing user_id or access_token. User ID in context: {user_db_id}.")
            return {"answer": "Đã có lỗi với phiên làm việc của bạn. Vui lòng thử 'khởi động lại' cuộc trò chuyện.",
                    "session_id": session_id}
        print(
            f"INFO (Service): Registered User: ID='{user_db_id}', Name='{user_name_for_greeting}'. Session ID: {session_id}")
    else:
        print(f"INFO (Service): Guest User (session_id: {session_id}).")
        current_context.setdefault("current_cart", [])

    anrede = user_name_for_greeting
    original_query_for_processing = user_query.strip()
    next_query_to_process = original_query_for_processing

    MAX_DISPATCH_LOOPS = 2
    dispatch_loops = 0
    while dispatch_loops < MAX_DISPATCH_LOOPS:
        dispatch_loops += 1
        current_query_for_this_loop = next_query_to_process
        next_query_to_process = None

        if not bot_response_content and current_context.get("pending_action"):
            bot_response_content = await intent_handlers.handle_pending_action(
                current_context, current_query_for_this_loop, anrede, llm_instance,
                is_registered_user, access_token_for_cart_api
            )

        if not bot_response_content and current_context.get("disambiguation_options"):
            response_from_disamb, query_after_disamb = await intent_handlers.handle_disambiguation(
                current_context, current_query_for_this_loop, anrede, llm_instance
            )
            if response_from_disamb: bot_response_content = response_from_disamb
            if query_after_disamb: next_query_to_process = query_after_disamb

        if not bot_response_content and not next_query_to_process:
            identified_intent, entities = await detect_intent_and_entities(current_query_for_this_loop, llm_instance)
            print(
                f"DEBUG Dispatcher: Intent='{identified_intent}', Entities='{entities}' for Query='{current_query_for_this_loop}'")

            if identified_intent == "ADD_TO_CART":
                if not is_registered_user:
                    bot_response_content = f"Chức năng giỏ hàng chỉ dành cho người dùng đã đăng nhập. Vui lòng đăng nhập để sử dụng tính năng này, {anrede} nhé."
                elif not access_token_for_cart_api:
                    bot_response_content = f"Xin lỗi {anrede}, có lỗi với thông tin xác thực của bạn, không thể thêm vào giỏ hàng lúc này."
                else:
                    bot_response_content = await intent_handlers.handle_add_to_cart_intent(
                        current_context, current_query_for_this_loop, anrede, llm_instance,
                        is_registered_user, access_token_for_cart_api
                    )
            elif identified_intent == "VIEW_CART":
                if not is_registered_user:
                    bot_response_content = f"Chức năng xem giỏ hàng chỉ dành cho người dùng đã đăng nhập. Vui lòng đăng nhập để sử dụng tính năng này, {anrede} nhé."
                elif not access_token_for_cart_api:
                    bot_response_content = f"Xin lỗi {anrede}, có lỗi với thông tin xác thực của bạn, không thể xem giỏ hàng lúc này."
                else:
                    bot_response_content = await intent_handlers.handle_view_cart_intent(
                        current_context, anrede, llm_instance,
                        is_registered_user, access_token_for_cart_api
                    )
            elif identified_intent == "GREETING":
                bot_response_content = f"Chào {anrede}! Mình là trợ lý dược sĩ AI, mình có thể giúp gì cho {anrede}?"
            else:
                product_search_term = helpers.extract_product_search_term(current_query_for_this_loop)
                bot_response_content = await intent_handlers.handle_product_search_or_context_query(
                    current_context, product_search_term, current_query_for_this_loop, anrede, llm_instance
                )

        if bot_response_content or not next_query_to_process:
            break

    if not bot_response_content:
        bot_response_content = await intent_handlers.handle_general_fallback(
            current_context, anrede, llm_instance, original_query_for_processing
        )

    current_context["last_interaction_time"] = datetime.utcnow().isoformat()
    save_session_context(session_id, current_context)

    # SỬA LỖI Ở ĐÂY:
    if conversation_log_collection_service is not None:
        model_name_to_log = "unknown_model"
        if hasattr(llm_instance, 'model_name') and llm_instance.model_name:
            model_name_to_log = llm_instance.model_name
        elif hasattr(llm_instance, 'model') and llm_instance.model:
            model_name_to_log = llm_instance.model

        helpers.log_conversation_turn(
            mongo_collection=conversation_log_collection_service,
            session_id=session_id, user_id=user_db_id, user_query=user_query,
            bot_response=bot_response_content, is_registered_user=is_registered_user,
            user_name_for_log=anrede, llm_model=model_name_to_log,  # Sử dụng biến đã kiểm tra
            current_context=current_context
        )
    else:
        print("WARNING (service): MongoDB collection for logging is not available (service level). Log skipped.")

    return {"answer": bot_response_content, "session_id": session_id}