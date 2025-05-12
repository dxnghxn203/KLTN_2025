from core import logger
from . import chatbot_helpers as helpers
from models import product as product_model
import re

async def handle_pending_action(current_context: dict, original_query: str, anrede: str, llm_instance,
                                is_registered_user: bool, access_token: str | None) -> str | None:
    bot_response = None
    pending_action = current_context.get("pending_action")
    if not pending_action: return None

    action_type = pending_action.get("type")
    action_data = pending_action.get("data", {})

    if action_type == "AWAITING_PRICE_OPTION_FOR_CART":
        product_stub = action_data.get("product_raw_data_stub")  # Đổi tên cho rõ
        quantity_to_add = action_data.get("quantity", 1)

        if isinstance(product_stub, dict) and product_stub.get("raw_prices_api"):
            raw_prices = product_stub.get("raw_prices_api", [])
            try:
                choice_idx = int(original_query.strip()) - 1
                if 0 <= choice_idx < len(raw_prices) and isinstance(raw_prices[choice_idx], dict):
                    selected_price_info = raw_prices[choice_idx]
                    price_id_api_cart = selected_price_info.get("price_id_api")
                    product_id_api_cart = product_stub.get("raw_product_id_api")
                    display_name = product_stub.get("product_name", "Sản phẩm")
                    display_unit = selected_price_info.get("unit", "")

                    if not product_id_api_cart or product_id_api_cart == "N/A":
                        bot_response = f"Xin lỗi {anrede}, sản phẩm '{display_name}' thiếu ID để thêm vào giỏ."
                    elif not price_id_api_cart:
                        bot_response = f"Xin lỗi {anrede}, lựa chọn giá cho '{display_name}' thiếu thông tin ID giá."
                    elif is_registered_user and access_token:
                        api_call_successful = helpers.add_to_cart_api(product_id_api_cart, price_id_api_cart,
                                                                      quantity_to_add, access_token)
                        bot_response = f"Đã thêm {quantity_to_add} {display_unit} {display_name} vào giỏ hàng của {anrede} rồi ạ." if api_call_successful \
                            else f"Rất tiếc {anrede}, đã có lỗi khi thêm {display_name} vào giỏ hàng. Vui lòng thử lại sau."
                    elif not is_registered_user:
                        bot_response = f"Chức năng giỏ hàng cho khách hiện đang được phát triển. {anrede} có thể đăng nhập để sử dụng."
                    else:
                        bot_response = f"Xin lỗi {anrede}, có lỗi xác thực, không thể thêm vào giỏ hàng lúc này."
                    current_context["pending_action"] = None
                else:
                    bot_response = f"Lựa chọn giá không hợp lệ. Vui lòng chọn số từ 1 đến {len(raw_prices)}."
            except ValueError:
                bot_response = "Vui lòng chọn số thứ tự của loại giá bạn muốn."
        else:
            bot_response = "Có lỗi xảy ra khi xử lý lựa chọn giá của bạn."
            current_context["pending_action"] = None
    return bot_response


async def handle_disambiguation(current_context: dict, original_query: str, anrede: str, llm_instance) -> tuple[
    str | None, str | None]:
    query_lower = original_query.lower().strip()
    if query_lower == "1" and current_context.get("disambiguation_options") and len(
            current_context["disambiguation_options"]) > 0:
        selected_raw = current_context["disambiguation_options"][0]
        current_context["last_explicit_product"] = helpers.format_product_for_prompt(selected_raw)
        current_context["disambiguation_options"] = None
        current_context["pending_action"] = None
        return (
        f"Bạn đã chọn: {current_context['last_explicit_product']['product_name']}. {anrede} cần thông tin gì thêm?",
        None)
    elif query_lower == "không":
        current_context["disambiguation_options"] = None
        current_context["pending_action"] = None
        return (f"Đã hủy lựa chọn. {anrede} cần gì khác không?", None)

    temp_extracted_term = helpers.extract_product_search_term(original_query)
    if temp_extracted_term != query_lower or not temp_extracted_term:
        current_context["disambiguation_options"] = None
        current_context["pending_action"] = None
        return (None, original_query)

    return (f"Lựa chọn không hợp lệ. Vui lòng chọn số hoặc nói 'không' để hủy.", None)


async def handle_add_to_cart_intent(current_context: dict, original_query: str, anrede: str, llm_instance,
                                    is_registered_user: bool, access_token: str | None) -> str | None:
    bot_response = None
    last_prod_formatted = current_context.get("last_explicit_product")

    if not last_prod_formatted or not isinstance(last_prod_formatted, dict) or last_prod_formatted.get(
            "product_name") == "N/A":
        return f"{anrede} muốn thêm sản phẩm nào vào giỏ ạ? Vui lòng cho mình biết tên sản phẩm nhé."

    quantity_to_add = 1
    match_quantity = re.search(r"(\d+)\s*(hộp|vỉ|chai|tuýp|viên|gói|liều|sản phẩm|cái)", original_query.lower())
    if match_quantity:
        try:
            quantity_to_add = int(match_quantity.group(1))
            if quantity_to_add <= 0: quantity_to_add = 1
        except ValueError:
            quantity_to_add = 1

    print(f"DEBUG (intent_handler AddToCart): Quantity extracted/defaulted to: {quantity_to_add}")

    product_id_api = last_prod_formatted.get("raw_product_id_api")
    raw_prices_api_list = last_prod_formatted.get("raw_prices_api", [])  # List các dict giá đã xử lý
    product_name = last_prod_formatted.get("product_name", "Sản phẩm")

    if not is_registered_user:
        return f"Chức năng giỏ hàng cho khách hiện đang được phát triển. {anrede} có thể đăng nhập để sử dụng."
    if not access_token:
        return f"Xin lỗi {anrede}, có lỗi xác thực, không thể thêm vào giỏ hàng."
    if not product_id_api or product_id_api == "N/A":
        return f"Xin lỗi {anrede}, sản phẩm '{product_name}' thiếu thông tin ID để thêm vào giỏ."

    if len(raw_prices_api_list) == 1 and isinstance(raw_prices_api_list[0], dict):
        price_info = raw_prices_api_list[0]
        price_id_api_cart = price_info.get("price_id_api")
        display_unit = price_info.get("unit", "")
        if price_id_api_cart:
            api_call_successful = helpers.add_to_cart_api(product_id_api, price_id_api_cart, quantity_to_add,
                                                          access_token)
            bot_response = f"Đã thêm {quantity_to_add} {display_unit} {product_name} vào giỏ hàng của {anrede} rồi ạ." if api_call_successful \
                else f"Rất tiếc {anrede}, đã có lỗi khi thêm {product_name} vào giỏ hàng."
        else:
            bot_response = f"Xin lỗi {anrede}, sản phẩm '{product_name}' thiếu thông tin đơn vị giá để thêm vào giỏ."
    elif len(raw_prices_api_list) > 1:
        current_context["pending_action"] = {
            "type": "AWAITING_PRICE_OPTION_FOR_CART",
            "data": {
                "product_raw_data_stub": {  # Tạo stub từ formatted data
                    "raw_product_id_api": product_id_api,
                    "product_name": product_name,
                    "raw_prices_api": raw_prices_api_list  # Truyền list giá đã xử lý
                },
                "quantity": quantity_to_add
            }
        }
        prices_display = last_prod_formatted.get("prices_formatted", "Sản phẩm này có nhiều lựa chọn giá.")
        bot_response = f"{anrede} ơi, sản phẩm '{product_name}' có các lựa chọn giá:\n{prices_display}\n{anrede} vui lòng chọn loại muốn thêm vào giỏ (nhập số thứ tự)."
    else:
        bot_response = f"Xin lỗi {anrede}, sản phẩm '{product_name}' hiện không có thông tin giá để thêm vào giỏ."
    return bot_response


async def handle_product_search_or_context_query(current_context: dict, product_search_term: str, original_query: str,
                                                 anrede: str, llm_instance) -> str:
    bot_response = None
    MAX_RECENTLY_MENTIONED = 5  # Giới hạn số sản phẩm trong recently_mentioned

    if not product_search_term:  # Câu hỏi về context hoặc câu hỏi chung
        last_prod_formatted = current_context.get("last_explicit_product")
        if last_prod_formatted and isinstance(last_prod_formatted, dict) and last_prod_formatted.get(
                "product_name") != "N/A":
            p_name_ctx = last_prod_formatted.get('product_name', 'sản phẩm này')
            # TODO: Xử lý nhanh câu hỏi giá/tồn kho nếu có thể (không cần LLM)
            query_lower = original_query.lower()
            if "giá" in query_lower or "bao nhiêu tiền" in query_lower:
                prices_info = last_prod_formatted.get('prices_formatted', 'Chưa có thông tin giá.')
                return f"{anrede} ơi, {p_name_ctx} có giá như sau:\n{prices_info}" if prices_info != 'Chưa có thông tin giá.' else f"Xin lỗi {anrede}, mình chưa có thông tin giá cho {p_name_ctx}."

            sys_p = helpers.BASE_SYSTEM_PERSONA_HELPERS.format(
                anrede=anrede) + f" Nhiệm vụ của bạn là cung cấp thông tin chi tiết về sản phẩm sau đây và trả lời câu hỏi của người dùng. Câu hỏi của người dùng là: '{original_query}'."
            human_m = f"Thông tin sản phẩm {p_name_ctx}:\n{helpers.product_data_formatted_to_str(last_prod_formatted)}\n\nHãy trả lời câu hỏi của {anrede}: '{original_query}'"
            bot_response = await helpers.get_llm_chat_response(llm_instance, sys_p, human_m)
        else:  # Câu hỏi chung, không có context sản phẩm
            sys_p = helpers.BASE_SYSTEM_PERSONA_HELPERS.format(
                anrede=anrede) + " Hãy trả lời câu hỏi của người dùng một cách thân thiện và hữu ích."
            bot_response = await helpers.get_llm_chat_response(llm_instance, sys_p, original_query)
    else:  # Tìm kiếm sản phẩm mới
        current_context["disambiguation_options"] = None  # Xóa disamb cũ

        # Giả sử product_model.get_product_by_name_fuzzy trả về list các dict sản phẩm thô từ DB
        found_products_raw_list = product_model.get_product_by_name_fuzzy(product_search_term)

        valid_raw_products = []
        if isinstance(found_products_raw_list, list):
            valid_raw_products = [p for p in found_products_raw_list if isinstance(p, dict)]
        elif isinstance(found_products_raw_list, dict):  # Nếu fuzzy search trả về một dict duy nhất
            valid_raw_products = [found_products_raw_list]

        if len(valid_raw_products) == 1:
            single_raw_product = valid_raw_products[0]
            product_data_formatted = helpers.format_product_for_prompt(single_raw_product)
            current_context["last_explicit_product"] = product_data_formatted

            # Add to recently_mentioned_products
            # (Cần logic để tránh trùng lặp và quản lý kích thước)
            current_context.get("recently_mentioned_products", []).insert(0, product_data_formatted)
            current_context["recently_mentioned_products"] = current_context.get("recently_mentioned_products", [])[
                                                             :MAX_RECENTLY_MENTIONED]

            sys_p = helpers.BASE_SYSTEM_PERSONA_HELPERS.format(
                anrede=anrede) + f" Nhiệm vụ của bạn là cung cấp thông tin chi tiết về sản phẩm sau đây. Câu hỏi gốc của người dùng là: '{original_query}' (tìm thấy sản phẩm '{product_data_formatted.get('product_name')}')."
            human_m = f"Thông tin sản phẩm {product_data_formatted.get('product_name', 'N/A')}:\n{helpers.product_data_formatted_to_str(product_data_formatted)}"
            bot_response = await helpers.get_llm_chat_response(llm_instance, sys_p, human_m)

        elif len(valid_raw_products) > 1:
            MAX_DISAMBIG_OPTS = 3
            disamb_options_to_store_raw = valid_raw_products[:MAX_DISAMBIG_OPTS]
            current_context["disambiguation_options"] = disamb_options_to_store_raw  # Lưu raw data
            current_context["last_explicit_product"] = None

            product_options_display_str = helpers.format_multiple_products_for_prompt(disamb_options_to_store_raw,
                                                                                      for_disambiguation=True)
            sys_p = helpers.BASE_SYSTEM_PERSONA_HELPERS.format(
                anrede=anrede) + " Nhiệm vụ của bạn là giúp người dùng làm rõ sản phẩm họ muốn từ danh sách dưới đây."
            human_m = f"{anrede} ơi, khi tìm '{product_search_term}', mình thấy có một vài sản phẩm:\n{product_options_display_str}\n{anrede} vui lòng chọn số thứ tự hoặc nói rõ hơn sản phẩm bạn muốn nhé."
            bot_response = await helpers.get_llm_chat_response(llm_instance, sys_p, human_m)
        else:  # Không tìm thấy sản phẩm nào
            current_context["last_explicit_product"] = None
            bot_response = helpers.PRODUCT_NOT_FOUND_MESSAGE_HELPERS.format(anrede=anrede).replace(
                "sản phẩm bạn tìm kiếm", f"sản phẩm '{product_search_term}'")
    return bot_response


async def handle_general_fallback(current_context: dict, anrede: str, llm_instance, original_query: str) -> str:
    current_context["last_explicit_product"] = None
    current_context["disambiguation_options"] = None
    current_context["pending_action"] = None
    # fallback_template = helpers.templates_helpers.get("default_fallback_template", "Xin lỗi {anrede}, mình chưa hiểu rõ câu hỏi của {anrede}. {anrede} có thể hỏi khác được không ạ?")
    # bot_response = fallback_template.format(anrede=anrede)
    sys_p = helpers.BASE_SYSTEM_PERSONA_HELPERS.format(
        anrede=anrede) + " Tôi không hiểu rõ yêu cầu này. Hãy trả lời một cách lịch sự và hỏi xem người dùng cần giúp gì khác."
    bot_response = await helpers.get_llm_chat_response(llm_instance, sys_p,
                                                       f"Câu hỏi của người dùng là: '{original_query}'")
    return bot_response

async def handle_view_cart_intent(current_context: dict, anrede: str, llm_instance, is_registered_user: bool, access_token: str | None) -> str:
    if not is_registered_user:
        return f"Chức năng xem giỏ hàng hiện chỉ dành cho người dùng đã đăng ký. {anrede} vui lòng đăng nhập để sử dụng nhé."

    if not access_token:
        return f"Xin lỗi {anrede}, hiện mình không xác thực được tài khoản. Vui lòng thử đăng nhập lại giúp mình nhé."

    cart_items = helpers.view_cart(access_token)['data']['products']
    logger.info(cart_items)
    if not cart_items or not isinstance(cart_items, list) or len(cart_items) == 0:
        return f"Giỏ hàng của {anrede} hiện đang trống ạ."

    total_price = 0
    item_lines = []
    for i, item in enumerate(cart_items, 1):
        prod_name = item.get('product')['product_name']
        quantity = item.get("quantity", 1)
        matched_price = next(
            (p for p in item.get('product')['prices'] if p["price_id"] == item.get('price_id')),
            None
        )
        logger.info(matched_price)
        unit = matched_price['unit']
        unit_price = matched_price['price']
        line_price = quantity * unit_price
        total_price += line_price

        item_lines.append(
            f"{i}. {prod_name} - {quantity} {unit} x {unit_price:,}đ = {line_price:,}đ"
        )

    cart_str = "\n".join(item_lines)
    return f"{anrede} ơi, đây là giỏ hàng của bạn:\n{cart_str}\n\nTổng cộng: {total_price:,}đ"
