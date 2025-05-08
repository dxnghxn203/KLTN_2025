import os
import json
import re
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from models import product as product_model  # Đảm bảo models/product.py có thể được import
from dotenv import load_dotenv
from core.redis import redis_client  # Đảm bảo core/redis.py có thể được import
import redis  # Cần import redis để bắt exception
from core.mongo import db as mongo_db_main_app  # Đảm bảo core/mongo.py có thể được import

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found in environment variables.")

llm = ChatOpenAI(
    openai_api_key=OPENAI_API_KEY,
    model_name="gpt-4o-mini",  # Hoặc model bạn đang dùng
    base_url=OPENAI_BASE_URL,
)

# --- START: Path Definitions & JSON Loading ---
# CURRENT_DIR trỏ đến thư mục chứa file chatbot.py này (ví dụ: .../services/)
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
# STATICS_DIR trỏ đến thư mục 'statics' nằm cùng cấp với thư mục cha của CURRENT_DIR
# Ví dụ: nếu CURRENT_DIR là .../project_root/services/, thì STATICS_DIR là .../project_root/statics/
STATICS_DIR = os.path.join(os.path.dirname(CURRENT_DIR), "statics")

print(f"DEBUG: Calculated STATICS_DIR: {STATICS_DIR}")  # Thêm dòng debug này


def load_prompt_templates():
    template_file_path = os.path.join(STATICS_DIR, "prompt_templates.json")
    print(f"DEBUG: Attempting to load prompt_templates from: {template_file_path}")  # Thêm dòng debug
    try:
        with open(template_file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"WARNING: prompt_templates.json not found at {template_file_path}. Using empty templates.")
        return {}
    except json.JSONDecodeError:
        print(f"ERROR: JSONDecodeError in prompt_templates.json at {template_file_path}. Using empty templates.")
        return {}


templates = load_prompt_templates()


def load_phrases_from_json(filename: str) -> list[str]:
    file_path = os.path.join(STATICS_DIR, filename)
    print(f"DEBUG: Attempting to load phrases from: {file_path}")  # Thêm dòng debug
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            phrases = json.load(f)
            if not isinstance(phrases, list):
                print(f"WARNING: Nội dung tệp {filename} không phải là một danh sách. Trả về rỗng.")
                return []
            phrases = [str(p).strip().lower() for p in phrases if isinstance(p, (str, int, float)) and str(p).strip()]
            return sorted(list(set(phrases)), key=len, reverse=True)
    except FileNotFoundError:
        print(f"CRITICAL WARNING: File '{filename}' not found at '{file_path}'. Phrase list will be empty.")
        return []
    except json.JSONDecodeError:
        print(f"CRITICAL WARNING: JSONDecodeError in '{filename}' at '{file_path}'. Phrase list will be empty.")
        return []


GENERAL_QUESTION_PHRASES = load_phrases_from_json("general_question_phrases.json")
if not GENERAL_QUESTION_PHRASES:
    print(
        "CRITICAL WARNING: general_question_phrases.json is empty or failed to load. Product name extraction will be severely impacted.")
# --- END: Path Definitions & JSON Loading ---


SESSION_CONTEXT_TTL_SECONDS = 1800


def get_session_context(session_id: str) -> dict | None:
    if not redis_client:
        print("WARNING: Redis client not available. Session context will not be used.")
        return None
    context_key = f"chatbot_session_context:{session_id}"
    context_json_string = None
    try:
        context_json_string = redis_client.get(context_key)
        if context_json_string:
            return json.loads(context_json_string)
    except redis.exceptions.RedisError as re_err:
        print(f"ERROR: Redis error while getting context for key {context_key}: {re_err}")
    except json.JSONDecodeError as je:
        print(
            f"ERROR: Could not decode JSON from Redis for key {context_key}: {je}. Value was: '{context_json_string}'")
    except Exception as e:
        print(f"ERROR: Unexpected error getting session context from Redis for key {context_key}: {e}")
    return None


def save_session_context(session_id: str, context_data: dict | None):
    if not redis_client:
        print("WARNING: Redis client not available. Session context will not be saved.")
        return
    context_key = f"chatbot_session_context:{session_id}"
    if context_data:
        try:
            context_json_string = json.dumps(context_data)
            redis_client.setex(context_key, SESSION_CONTEXT_TTL_SECONDS, context_json_string)
        except redis.exceptions.RedisError as re_err:
            print(f"ERROR: Redis error while saving context for key {context_key}: {re_err}")
        except TypeError as te:
            print(f"ERROR: Could not serialize session context to JSON for Redis: {te}. Data was: {context_data}")
        except Exception as e:
            print(f"ERROR: Unexpected error saving session context to Redis for key {context_key}: {e}")
    else:
        try:
            redis_client.delete(context_key)
        except redis.exceptions.RedisError as re_err:
            print(f"ERROR: Redis error while deleting context for key {context_key}: {re_err}")
        except Exception as e:
            print(f"ERROR: Unexpected error deleting session context from Redis for key {context_key}: {e}")


conversation_log_collection = mongo_db_main_app['conversation_logs']


def log_conversation_turn(session_id: str, user_id: str | None, user_query: str, bot_response: str,
                          user_type: str, user_name: str | None,
                          llm_model: str | None = "gpt-4o-mini", intent: str | None = None,
                          entities: dict | None = None, current_context: dict | None = None):
    log_entry = {
        "session_id": session_id, "user_id": user_id, "user_type": user_type, "user_name_provided": user_name,
        "timestamp": datetime.utcnow(), "user_query": user_query, "bot_response": bot_response,
        "llm_model_used": llm_model, "identified_intent": intent, "entities_extracted": entities,
        "context_at_turn": current_context
    }
    try:
        conversation_log_collection.insert_one(log_entry)
    except Exception as e:
        print(f"ERROR: Failed to log conversation turn to MongoDB: {e}")


def format_product_for_prompt(product_data):
    if not product_data or not isinstance(product_data, dict):
        return {
            "product_name": "N/A", "description": "Không có thông tin.", "uses": "Không có thông tin.",
            "ingredients": "Không có thông tin.", "dosage": "Không có thông tin.",
            "side_effects": "Không có thông tin.", "precautions": "Không có thông tin.",
            "prices_formatted": "Chưa có thông tin giá.", "inventory": "Không rõ"
        }

    ingredients_list = product_data.get("ingredients", [])
    ingredients_str = ", ".join([f"{ing.get('ingredient_name', 'N/A')} ({ing.get('ingredient_amount', '')})" for ing in
                                 ingredients_list]) if ingredients_list else "Không có thông tin."

    prices_list = product_data.get("prices", [])
    prices_formatted_parts = []
    if prices_list:
        for price_item in prices_list:
            if not isinstance(price_item, dict): continue
            try:
                unit = price_item.get("unit", "Đơn vị")
                amount = price_item.get("amount", 1)
                price_val = price_item.get("price")
                original_price_val = price_item.get("original_price")
                discount_percent = price_item.get("discount", 0)
                price_str = f"{price_val:,.0f}đ" if isinstance(price_val, (int, float)) else "N/A"
                unit_display = f"{unit} {amount}" if unit.lower() not in ["viên", "gói", "ống",
                                                                          "miếng"] and amount > 1 else unit
                if unit.lower() in ["hộp", "chai", "tuýp"] and amount > 1 and any(
                        u_unit in unit.lower() for u_unit in ["viên", "gói", "ml"]):
                    pass
                elif unit.lower() in ["viên", "gói", "ống", "miếng"]:
                    unit_display = unit
                price_part = f"{unit_display}: {price_str}"
                if discount_percent > 0 and isinstance(original_price_val, (int, float)):
                    original_price_str = f"{original_price_val:,.0f}đ"
                    price_part += f" (giá gốc {original_price_str}, giảm {discount_percent:.0f}%)"
                prices_formatted_parts.append(price_part)
            except (TypeError, ValueError) as e:
                print(f"DEBUG: Error formatting price_item {price_item}: {e}")
                prices_formatted_parts.append(f"{price_item.get('unit', 'Đơn vị')}: Giá không hợp lệ")
    prices_formatted_str = "\n".join(prices_formatted_parts) if prices_formatted_parts else "Chưa có thông tin giá."
    if len(prices_formatted_parts) > 1: prices_formatted_str = "Hiện có các mức giá sau:\n" + prices_formatted_str
    inventory_val = product_data.get("inventory")
    inventory_str = str(inventory_val) if inventory_val is not None else "Không rõ"

    return {
        "product_name": str(product_data.get("name_primary") or product_data.get("product_name", "N/A")),
        "description": str(product_data.get("description", "Không có thông tin.")),
        "uses": str(product_data.get("uses", "Không có thông tin.")),
        "ingredients": ingredients_str,
        "dosage": str(product_data.get("dosage", "Không có thông tin.")),
        "side_effects": str(product_data.get("side_effects", "Không có thông tin.")),
        "precautions": str(product_data.get("precautions", "Không có thông tin.")),
        "prices_formatted": prices_formatted_str,
        "inventory": inventory_str
    }


def format_multiple_products_for_prompt(products_list, for_disambiguation=False):
    if not products_list:
        return "Không tìm thấy sản phẩm nào phù hợp."
    info_str = ""
    for i, p_data in enumerate(products_list):
        if not isinstance(p_data, dict): continue
        p_name = str(p_data.get("name_primary") or p_data.get("product_name", "Sản phẩm không rõ tên"))
        if for_disambiguation:
            info_str += f"{i + 1}. {p_name}\n"
        else:
            p_uses = str(p_data.get("uses", "Không có thông tin công dụng."))
            info_str += f"\nSản phẩm {i + 1}:\n  Tên: {p_name}\n  Công dụng: {p_uses}\n"
    return info_str.strip()


def extract_product_search_term(query: str) -> str:
    print(f"\nDEBUG extract_term: --- Original Query: '{query}' ---")
    processed_query = query.lower().strip()
    processed_query = re.sub(r'\s+', ' ', processed_query)
    print(f"DEBUG extract_term: Normalized query: '{processed_query}'")

    confirmation_starters = [
        "đúng rồi", "đúng", "ok", "yes", "đồng ý", "chính xác", "vâng", "ừ", "uh",
        "okie", "oke", "okay", "chính nó", "nó đó", "là nó"
    ]
    common_follow_up_keywords_for_conf_check = [
        "giá", "bao nhiêu", "công dụng", "thành phần", "liều dùng", "tác dụng", "cách dùng", "còn hàng",
        "thông tin", "chi tiết", "thêm", "nữa", "khác", "gì", "sao", "thế nào", "như nào", "còn không"
    ]

    for conf_starter in confirmation_starters:
        if processed_query.startswith(conf_starter):
            if processed_query == conf_starter or \
                    re.fullmatch(re.escape(conf_starter) + r'[ ,.!?]*', processed_query):
                print(f"DEBUG extract_term: (Conf) Detected confirmation only: '{processed_query}'. Returning empty.")
                return ""
            potential_follow_up = processed_query[len(conf_starter):].lstrip(' ,.!?')
            if not potential_follow_up:
                print(
                    f"DEBUG extract_term: (Conf) Detected confirmation only (with punctuation): '{processed_query}'. Returning empty.")
                return ""
            is_general_q_in_follow_up = any(gqp in potential_follow_up for gqp in GENERAL_QUESTION_PHRASES if
                                            len(gqp) > 2 and gqp in potential_follow_up)
            is_keyword_q_in_follow_up = any(
                kw_fol in potential_follow_up for kw_fol in common_follow_up_keywords_for_conf_check)
            if is_general_q_in_follow_up or is_keyword_q_in_follow_up:
                print(
                    f"DEBUG extract_term: (Conf) Detected confirmation + follow-up question. Follow-up: '{potential_follow_up}'. Returning empty.")
                return ""
            print(
                f"DEBUG extract_term: (Conf) Confirmation starter found, but follow-up ('{potential_follow_up}') seems like a new product. Proceeding with stripping.")

    current_term = processed_query
    print(f"DEBUG extract_term: Initial term for iterative GQP stripping: '{current_term}'")
    MAX_ITERATIONS = 10
    iterations = 0
    changed_in_iteration = True

    while changed_in_iteration and iterations < MAX_ITERATIONS:
        changed_in_iteration = False
        iterations += 1
        term_before_this_pass = current_term
        for phrase in GENERAL_QUESTION_PHRASES:
            if current_term.startswith(phrase + " "):
                current_term = current_term[len(phrase) + 1:].strip()
                print(f"DEBUG extract_term: (Iter {iterations} - Start) Stripped '{phrase}'. Term: '{current_term}'")
                changed_in_iteration = True
                break
            elif current_term == phrase:
                print(
                    f"DEBUG extract_term: (Iter {iterations} - Start) Entire term is GQP '{phrase}'. Returning empty.")
                return ""
        if changed_in_iteration:
            if not current_term:
                print(f"DEBUG extract_term: (Iter {iterations} - Start) Term became empty. Returning empty.")
                return ""
            continue
        for phrase in GENERAL_QUESTION_PHRASES:
            if current_term.endswith(" " + phrase):
                current_term = current_term[:-len(" " + phrase)].strip()
                print(f"DEBUG extract_term: (Iter {iterations} - End) Stripped '{phrase}'. Term: '{current_term}'")
                changed_in_iteration = True
                break
            elif current_term == phrase:
                print(f"DEBUG extract_term: (Iter {iterations} - End) Entire term is GQP '{phrase}'. Returning empty.")
                return ""
        if not current_term:
            print(f"DEBUG extract_term: (Iter {iterations} - End) Term became empty. Returning empty.")
            return ""
        if term_before_this_pass == current_term and not changed_in_iteration:
            print(
                f"DEBUG extract_term: (Iter {iterations}) No change in this pass. Term: '{current_term}'. Breaking GQP strip loop.")
            break
    if iterations >= MAX_ITERATIONS:
        print(f"DEBUG extract_term: WARNING - Max GQP stripping iterations reached. Term: '{current_term}'")

    final_term = current_term.strip()
    print(f"DEBUG extract_term: Term after iterative GQP stripping: '{final_term}'")
    if not final_term:
        print(f"DEBUG extract_term: Final term is empty. Returning empty.")
        return ""
    if final_term in GENERAL_QUESTION_PHRASES:
        print(f"DEBUG extract_term: Final term itself is a GQP ('{final_term}'). Returning empty.")
        return ""
    if final_term and final_term[-1] in ['?', '.', '!', ',']:
        final_term = final_term[:-1].strip()
    if not final_term:
        print(f"DEBUG extract_term: Final term empty after punctuation strip. Returning empty.")
        return ""
    print(f"DEBUG extract_term: === Final Extracted Product Search Term: '{final_term}' (from Original: '{query}') ===")
    return final_term


async def handle_user_query(user_query: str, session_id: str, user_id: str | None,
                            user_type: str, user_name: str | None):
    anrede = user_name.strip() + " ơi" if user_type == 'user' and user_name and user_name.strip() else "bạn"
    bot_response_content = ""
    current_context = get_session_context(session_id)
    if current_context is None:
        current_context = {}
        print(f"INFO (Session: {session_id}): New session or context expired. Starting fresh context.")

    original_query_for_processing = user_query
    query_for_selection_lower = user_query.lower().strip().rstrip('?.!')

    pending_disambiguation_options = current_context.get("disambiguation_options")
    selected_product_from_disamb = None
    follow_up_query_after_disamb_selection = ""

    if pending_disambiguation_options and isinstance(pending_disambiguation_options, list):
        print(
            f"DEBUG (Session: {session_id}): Pending disambiguation. Options: {[p.get('name_primary', 'N/A') for p in pending_disambiguation_options]}")
        if query_for_selection_lower.isdigit():
            try:
                choice_idx = int(query_for_selection_lower) - 1
                if 0 <= choice_idx < len(pending_disambiguation_options):
                    selected_product_from_disamb = pending_disambiguation_options[choice_idx]
                    print(
                        f"DEBUG (Session: {session_id}): User selected by number: {choice_idx + 1}. Product: {selected_product_from_disamb.get('name_primary')}")
            except ValueError:
                pass

        if not selected_product_from_disamb:
            for product_option in pending_disambiguation_options:
                option_name_primary = str(product_option.get("name_primary", "")).lower()
                option_name_secondary = str(product_option.get("product_name", "")).lower()
                if query_for_selection_lower in option_name_primary or \
                        (option_name_secondary and query_for_selection_lower in option_name_secondary):
                    selected_product_from_disamb = product_option
                    print(
                        f"DEBUG (Session: {session_id}): User selected by name match: '{query_for_selection_lower}'. Product: {selected_product_from_disamb.get('name_primary')}")
                    break
            if not selected_product_from_disamb:
                confirmation_starters_for_selection = [
                    "đúng rồi", "đúng", "ok", "yes", "đồng ý", "chính xác", "vâng", "ừ",
                    "okie", "oke", "okay", "chính nó", "nó đó", "là nó", "cái đó",
                    "cái đầu tiên", "số 1", "lựa chọn 1", "lấy cái đầu", "chọn cái đầu tiên", "sản phẩm đầu tiên"
                ]
                for conf_sel_starter in confirmation_starters_for_selection:
                    if query_for_selection_lower.startswith(conf_sel_starter):
                        if pending_disambiguation_options:
                            selected_product_from_disamb = pending_disambiguation_options[0]
                            follow_up_query_after_disamb_selection = original_query_for_processing[
                                                                     len(conf_sel_starter):].lstrip(' ,.!?')
                            print(
                                f"DEBUG (Session: {session_id}): User confirmed first item via '{conf_sel_starter}'. Product: {selected_product_from_disamb.get('name_primary')}. Follow-up: '{follow_up_query_after_disamb_selection}'")
                            break

        if selected_product_from_disamb:
            current_context["disambiguation_options"] = None
            product_data_formatted = format_product_for_prompt(selected_product_from_disamb)
            current_context[
                "last_product_info"] = product_data_formatted if product_data_formatted and product_data_formatted.get(
                "product_name") != "N/A" else None

            if follow_up_query_after_disamb_selection:
                print(
                    f"DEBUG (Session: {session_id}): Processing follow-up '{follow_up_query_after_disamb_selection}' for selected product.")
                user_query = follow_up_query_after_disamb_selection
                product_search_term = extract_product_search_term(user_query)  # Re-extract for the follow-up
            else:
                system_persona = (
                    f"Bạn là một dược sĩ AI tại Việt Nam, rất am hiểu về các sản phẩm thuốc và thực phẩm chức năng. "
                    f"Hãy luôn xưng hô với người dùng là '{anrede}' một cách thân thiện, nhẹ nhàng và dễ hiểu. "
                    f"Người dùng vừa chọn sản phẩm này từ một danh sách. Hãy cung cấp thông tin chi tiết về sản phẩm này."
                )
                human_message_content_parts = [
                    f"Thông tin sản phẩm {product_data_formatted.get('product_name', 'N/A')}:",
                    f"- Mô tả: {product_data_formatted.get('description', 'N/A')}",
                    f"- Công dụng: {product_data_formatted.get('uses', 'N/A')}",
                    f"- Thành phần: {product_data_formatted.get('ingredients', 'N/A')}",
                    f"- Liều dùng: {product_data_formatted.get('dosage', 'N/A')}",
                    f"- Tác dụng phụ (nếu có): {product_data_formatted.get('side_effects', 'N/A')}",
                    f"- Lưu ý quan trọng: {product_data_formatted.get('precautions', 'N/A')}",
                    f"- Giá sản phẩm:\n{product_data_formatted.get('prices_formatted', 'Chưa có thông tin giá.')}",
                    f"- Tình trạng tồn kho: {product_data_formatted.get('inventory', 'N/A')} sản phẩm."
                ]
                human_message_content = "\n".join(filter(None, human_message_content_parts))
                llm_response = await llm.ainvoke(
                    [SystemMessage(content=system_persona), HumanMessage(content=human_message_content)])
                bot_response_content = llm_response.content
                save_session_context(session_id, current_context)
                log_conversation_turn(session_id, user_id, original_query_for_processing, bot_response_content,
                                      user_type, user_name, current_context=current_context)
                return bot_response_content

        elif query_for_selection_lower in ["không", "thôi", "không phải", "bỏ qua", "cancel", "không có",
                                           "không phải cái nào", "không chọn", "không cần", "để sau"]:
            current_context["disambiguation_options"] = None
            bot_response_content = f"Dạ vâng ạ. {anrede} cần tôi hỗ trợ tìm sản phẩm nào khác hoặc có câu hỏi nào khác không?"
            save_session_context(session_id, current_context)
            log_conversation_turn(session_id, user_id, original_query_for_processing, bot_response_content, user_type,
                                  user_name, current_context=current_context)
            return bot_response_content
        else:
            bot_response_content = f"Dạ, tôi chưa hiểu lựa chọn của {anrede}. {anrede} vui lòng chọn số thứ tự, gõ lại một phần tên sản phẩm hoặc nói 'không phải' nếu không có sản phẩm nào đúng ý ạ."
            save_session_context(session_id, current_context)
            log_conversation_turn(session_id, user_id, original_query_for_processing, bot_response_content, user_type,
                                  user_name, current_context=current_context)
            return bot_response_content

    # If not in disambiguation or if it was a follow-up, extract term
    if not selected_product_from_disamb or follow_up_query_after_disamb_selection:  # Ensure re-extraction if needed
        product_search_term = extract_product_search_term(user_query)

    LAST_MENTIONED_PRODUCT_CONTEXT = current_context.get("last_product_info")
    print(
        f"DEBUG (Session: {session_id}, User: {anrede}): User Query: '{user_query}', Extracted Term: '{product_search_term}', LastProductCtx: {LAST_MENTIONED_PRODUCT_CONTEXT is not None}")

    if not product_search_term:
        if LAST_MENTIONED_PRODUCT_CONTEXT and isinstance(LAST_MENTIONED_PRODUCT_CONTEXT, dict):
            product_name_from_context = LAST_MENTIONED_PRODUCT_CONTEXT.get('product_name', 'sản phẩm này')
            query_lower_for_intent = user_query.lower()
            follow_up_keywords_price = ["giá", "bao nhiêu tiền", "giá bán", "cost", "price", "giá cả", "giá sao",
                                        "giá ntn", "giá thế nào"]
            follow_up_keywords_stock = ["còn hàng", "tồn kho", "số lượng", "stock", "inventory", "còn ko", "còn k",
                                        "còn không", "còn ko shop", "còn bán không"]
            intent_response_generated = False
            if any(kw in query_lower_for_intent for kw in follow_up_keywords_price):
                prices_info = LAST_MENTIONED_PRODUCT_CONTEXT.get('prices_formatted', 'Chưa có thông tin giá.')
                bot_response_content = f"{anrede} ơi, {product_name_from_context} có các mức giá như sau:\n{prices_info}" if prices_info and prices_info != 'Chưa có thông tin giá.' else f"Dạ xin lỗi {anrede}, hiện tại tôi chưa có thông tin giá chính xác cho {product_name_from_context} ạ."
                intent_response_generated = True
            elif any(kw in query_lower_for_intent for kw in follow_up_keywords_stock):
                inventory = LAST_MENTIONED_PRODUCT_CONTEXT.get('inventory', 'Không rõ')
                if inventory != 'Không rõ' and str(inventory) != '0':
                    bot_response_content = f"Dạ, {product_name_from_context} hiện vẫn còn hàng ({inventory} sản phẩm) nhé {anrede}."
                elif str(inventory) == '0':
                    bot_response_content = f"Rất tiếc {anrede} ơi, {product_name_from_context} bên mình đã hết hàng mất rồi."
                else:
                    bot_response_content = f"Dạ, để tôi kiểm tra lại thông tin tồn kho cho {product_name_from_context} nhé, {anrede} vui lòng đợi một chút ạ."
                intent_response_generated = True

            if not intent_response_generated:
                system_persona = (
                    f"Bạn là một dược sĩ AI tại Việt Nam, rất am hiểu về các sản phẩm thuốc và thực phẩm chức năng. "
                    f"Hãy luôn xưng hô với người dùng là '{anrede}' một cách thân thiện, nhẹ nhàng và dễ hiểu. "
                    f"Nhiệm vụ của bạn là trả lời câu hỏi của người dùng một cách chính xác dựa trên thông tin sản phẩm đã biết sau đây."
                )
                human_message_content_parts = [
                    f"Thông tin sản phẩm {product_name_from_context} mà chúng ta đang nói đến:",
                    f"- Mô tả: {LAST_MENTIONED_PRODUCT_CONTEXT.get('description', 'N/A')}",
                    f"- Công dụng: {LAST_MENTIONED_PRODUCT_CONTEXT.get('uses', 'N/A')}",
                    f"- Thành phần: {LAST_MENTIONED_PRODUCT_CONTEXT.get('ingredients', 'N/A')}",
                    f"- Liều dùng: {LAST_MENTIONED_PRODUCT_CONTEXT.get('dosage', 'N/A')}",
                    f"- Tác dụng phụ: {LAST_MENTIONED_PRODUCT_CONTEXT.get('side_effects', 'N/A')}",
                    f"- Lưu ý: {LAST_MENTIONED_PRODUCT_CONTEXT.get('precautions', 'N/A')}",
                    f"- Giá: {LAST_MENTIONED_PRODUCT_CONTEXT.get('prices_formatted', 'N/A')}",
                    f"- Tồn kho: {LAST_MENTIONED_PRODUCT_CONTEXT.get('inventory', 'N/A')}",
                    f"\nCâu hỏi của {anrede}: {user_query}"
                ]
                human_message_content = "\n".join(filter(None, human_message_content_parts))
                llm_response = await llm.ainvoke(
                    [SystemMessage(content=system_persona), HumanMessage(content=human_message_content)])
                bot_response_content = llm_response.content
        else:
            system_persona_general_fallback = (
                f"Bạn là một dược sĩ AI tại Việt Nam, rất thân thiện và nhiệt tình. "
                f"Hãy luôn xưng hô với người dùng là '{anrede}'. "
                f"Người dùng vừa hỏi một câu chung chung không rõ về sản phẩm nào. Hãy trả lời một cách lịch sự, hỏi xem họ cần giúp gì hoặc có thể gợi ý một số chức năng bạn có thể làm."
            )
            human_message_general_fallback = f"Câu hỏi của {anrede}: {user_query}"
            llm_response = await llm.ainvoke([SystemMessage(content=system_persona_general_fallback),
                                              HumanMessage(content=human_message_general_fallback)])
            bot_response_content = llm_response.content
            current_context["last_product_info"] = None
            current_context["disambiguation_options"] = None

    elif product_search_term and not bot_response_content:
        print(f"DEBUG (Session: {session_id}): Attempting product search for term: '{product_search_term}'")
        found_products_raw = product_model.get_product_by_name_fuzzy(product_search_term)
        found_product_single = None
        found_products_list_for_disamb = []

        if isinstance(found_products_raw, dict):
            found_product_single = found_products_raw
        elif isinstance(found_products_raw, list) and found_products_raw:
            found_products_list_for_disamb = found_products_raw
            MAX_DISAMBIGUATION_OPTIONS = 3
            if len(found_products_list_for_disamb) > MAX_DISAMBIGUATION_OPTIONS:
                found_products_list_for_disamb = found_products_list_for_disamb[:MAX_DISAMBIGUATION_OPTIONS]

        if found_product_single:
            product_data_formatted = format_product_for_prompt(found_product_single)
            current_context["last_product_info"] = product_data_formatted
            current_context["disambiguation_options"] = None
            system_persona = (
                f"Bạn là một dược sĩ AI tại Việt Nam, rất am hiểu về các sản phẩm thuốc và thực phẩm chức năng. "
                f"Hãy luôn xưng hô với người dùng là '{anrede}' một cách thân thiện, nhẹ nhàng và dễ hiểu. "
                f"Nhiệm vụ của bạn là cung cấp thông tin chi tiết về sản phẩm sau đây và trả lời câu hỏi của người dùng (nếu có) liên quan đến sản phẩm này. "
                f"Câu hỏi gốc của người dùng là: '{original_query_for_processing}'."
            )
            human_message_content_parts = [
                f"Thông tin sản phẩm {product_data_formatted.get('product_name', 'N/A')}:",
                f"- Mô tả: {product_data_formatted.get('description', 'N/A')}",
                f"- Công dụng: {product_data_formatted.get('uses', 'N/A')}",
                f"- Thành phần: {product_data_formatted.get('ingredients', 'N/A')}",
                f"- Liều dùng: {product_data_formatted.get('dosage', 'N/A')}",
                f"- Tác dụng phụ (nếu có): {product_data_formatted.get('side_effects', 'N/A')}",
                f"- Lưu ý quan trọng: {product_data_formatted.get('precautions', 'N/A')}",
                f"- Giá sản phẩm:\n{product_data_formatted.get('prices_formatted', 'Chưa có thông tin giá.')}",
                f"- Tình trạng tồn kho: {product_data_formatted.get('inventory', 'N/A')} sản phẩm."
            ]
            human_message_content = "\n".join(filter(None, human_message_content_parts))
            llm_response = await llm.ainvoke(
                [SystemMessage(content=system_persona), HumanMessage(content=human_message_content)])
            bot_response_content = llm_response.content
        elif found_products_list_for_disamb:
            current_context["last_product_info"] = None
            current_context["disambiguation_options"] = found_products_list_for_disamb
            product_options_str = format_multiple_products_for_prompt(found_products_list_for_disamb,
                                                                      for_disambiguation=True)
            system_persona_disamb = (
                f"Bạn là một dược sĩ AI tại Việt Nam, rất am hiểu về các sản phẩm thuốc và thực phẩm chức năng. "
                f"Hãy luôn xưng hô với người dùng là '{anrede}' một cách thân thiện, nhẹ nhàng và dễ hiểu. "
                f"Nhiệm vụ của bạn là giúp người dùng làm rõ sản phẩm họ muốn từ danh sách dưới đây, trình bày các lựa chọn một cách rõ ràng."
            )
            disamb_prompt_intro = f"{anrede} ơi, khi tìm '{product_search_term}', tôi thấy có một vài sản phẩm có tên gần giống như sau:\n{product_options_str}\n"
            disamb_prompt_question = (
                f"Có phải {anrede} đang tìm sản phẩm '{found_products_list_for_disamb[0].get('name_primary', 'này')}' không ạ? "
                f"{anrede} có thể xác nhận hoặc cung cấp thêm tên nếu chưa đúng nhé."
            ) if len(found_products_list_for_disamb) == 1 else (
                f"{anrede} muốn biết thêm thông tin chi tiết về sản phẩm nào trong danh sách này? "
                f"{anrede} có thể chọn số thứ tự, nhập một phần tên, hoặc nếu sản phẩm đầu tiên là đúng ý, {anrede} có thể nói 'đúng rồi' hoặc 'cái đầu tiên' nhé."
            )
            human_message_disamb = disamb_prompt_intro + disamb_prompt_question
            llm_response_disamb = await llm.ainvoke(
                [SystemMessage(content=system_persona_disamb), HumanMessage(content=human_message_disamb)])
            bot_response_content = llm_response_disamb.content
        else:
            system_persona_specific_not_found = (
                f"Bạn là một dược sĩ AI tại Việt Nam. "
                f"Hãy luôn xưng hô với người dùng là '{anrede}' một cách thân thiện, nhẹ nhàng và dễ hiểu. "
                f"Người dùng hỏi về sản phẩm '{product_search_term}' nhưng bạn không tìm thấy trong cơ sở dữ liệu. "
                f"Hãy giải thích điều này một cách lịch sự và gợi ý họ cung cấp tên đầy đủ hơn hoặc hỏi về sản phẩm khác."
            )
            human_message_specific_not_found = (
                f"{anrede} ơi, tôi đã tìm kiếm sản phẩm có tên giống như '{product_search_term}' nhưng rất tiếc là hiện tại tôi không tìm thấy thông tin. "
                f"{anrede} có thể vui lòng kiểm tra lại tên sản phẩm hoặc cung cấp thêm chi tiết để tôi hỗ trợ tốt hơn không ạ? "
                f"Hoặc {anrede} có cần tìm sản phẩm nào khác không?"
            )
            llm_response = await llm.ainvoke([SystemMessage(content=system_persona_specific_not_found),
                                              HumanMessage(content=human_message_specific_not_found)])
            bot_response_content = llm_response.content
            current_context["last_product_info"] = None
            current_context["disambiguation_options"] = None

    if not bot_response_content:
        print(f"WARNING (Session: {session_id}): No specific logic handled the query. Using general fallback.")
        current_context["last_product_info"] = None
        current_context["disambiguation_options"] = None
        default_fallback_msg_template = templates.get("default_fallback_template",
                                                      "Xin lỗi {anrede}, tôi chưa hiểu rõ câu hỏi của {anrede} hoặc không tìm thấy thông tin phù hợp. {anrede} có thể cung cấp tên sản phẩm cụ thể hoặc mô tả rõ hơn được không ạ?"
                                                      )
        bot_response_content = default_fallback_msg_template.format(anrede=anrede)

    save_session_context(session_id, current_context)
    log_conversation_turn(session_id, user_id, original_query_for_processing, bot_response_content, user_type,
                          user_name, current_context=current_context)
    return bot_response_content
