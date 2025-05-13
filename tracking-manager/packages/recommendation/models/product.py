from bson import ObjectId
from thefuzz import process, fuzz

from core.mongo import db

products_collection = db['products']


def product_helper(product) -> dict:
    # Đảm bảo _id luôn được chuyển thành id và là string
    if product and "_id" in product:
        product["id"] = str(product["_id"])
        # Không cần xóa _id gốc nếu product_helper chỉ dùng để trả về API
        # Nếu _id object gây lỗi JSON serialization ở đâu đó thì mới cần
        # del product["_id"] # Thường không cần thiết nếu client xử lý tốt

    # Chuyển đổi các ObjectId khác nếu có (ví dụ: trong các sub-document)
    # Cần cẩn thận nếu cấu trúc phức tạp. Hiện tại, tập trung vào các trường ObjectId cấp cao nhất.
    return {
        **{k: str(v) if isinstance(v, ObjectId) else v for k, v in product.items()}
    }


def get_product_by_id(product_id: str):
    product_doc = None
    try:
        # Thử tìm bằng ObjectId trước nếu product_id có thể là string của ObjectId
        if ObjectId.is_valid(product_id):
            product_doc = products_collection.find_one({"_id": ObjectId(product_id)})

        if not product_doc:  # Nếu không phải ObjectId string hoặc không tìm thấy, thử tìm bằng trường product_id (nếu bạn có trường này)
            # Giả sử product_id cũng là một trường string duy nhất bạn có thể query
            product_doc = products_collection.find_one({
                                                           "product_id_custom_field": product_id})  # Thay "product_id_custom_field" bằng tên trường thực tế nếu có
            if not product_doc:  # Nếu vẫn không tìm thấy, có thể thử tìm bằng các trường khác nếu product_id không phải ObjectId
                product_doc = products_collection.find_one({"name_primary": product_id})  # Ví dụ

    except Exception as e:
        print(f"Error finding product by ID '{product_id}': {e}")
        # Fallback nếu có lỗi khi thử ObjectId, vẫn thử tìm bằng product_id string (nếu có trường đó)
        if not product_doc:
            try:
                product_doc = products_collection.find_one({"product_id_custom_field": product_id})  # Thay thế nếu cần
            except Exception as e_fallback:
                print(f"Fallback error finding product by product_id string '{product_id}': {e_fallback}")

    if product_doc:
        return product_helper(product_doc)
    return None


# def get_product_by_name_fuzzy(query_name: str, limit: int = 5,
#                               exact_match_threshold: int = 80,
#                               list_threshold: int = 65):
#
#     print(f"\nDEBUG product_model: --- Starting get_product_by_name_fuzzy for query: '{query_name}' ---")
#     print(
#         f"DEBUG product_model: Looser Thresholds: exact={exact_match_threshold}, list={list_threshold}, limit={limit}")
#
#     # Chỉ lấy các sản phẩm có product_name hoặc name_primary không rỗng
#     all_products_cursor = products_collection.find(
#         {"$or": [
#             {"product_name": {"$ne": None, "$ne": ""}},
#             {"name_primary": {"$ne": None, "$ne": ""}},
#             {"uses": {"$ne": None, "$ne": ""}}
#         ]},
#         {"product_name": 1, "name_primary": 1, "uses": 1, "_id": 1}
#     )
#
#     product_names_map = {}
#     choices = []
#     count = 0
#
#     for p_doc in all_products_cursor:
#         count += 1
#         name_to_check = p_doc.get("name_primary") or p_doc.get("product_name") or p_doc.get("uses")
#
#         if name_to_check:
#             product_names_map[name_to_check] = {"_id": p_doc["_id"]}
#             if name_to_check not in choices:
#                 choices.append(name_to_check)
#
#     print(f"DEBUG product_model: Total products processed for choices: {count}")
#     print(f"DEBUG product_model: Number of unique names in choices: {len(choices)}")
#
#     if not choices:
#         print("DEBUG product_model: No product names found in DB to perform fuzzy search. Returning None.")
#         return None
#
#     sample_size = min(10, len(choices))
#     print(f"DEBUG product_model: Sample of choices (first {sample_size}): {choices[:sample_size]}")
#
#     scorer_to_use = fuzz.token_set_ratio
#     print(f"DEBUG product_model: Using scorer: {scorer_to_use.__name__}")
#
#     best_match_tuple = process.extractOne(query_name, choices, scorer=scorer_to_use)
#     print(f"DEBUG product_model: extractOne result for '{query_name}': {best_match_tuple}")
#
#     if best_match_tuple and best_match_tuple[1] >= exact_match_threshold:
#         matched_name = best_match_tuple[0]
#         score = best_match_tuple[1]
#         print(
#             f"DEBUG product_model: Exact match found! Score {score} >= {exact_match_threshold} for name '{matched_name}'")
#
#         partial_doc = product_names_map.get(matched_name)
#         if partial_doc and "_id" in partial_doc:
#             full_product_doc = products_collection.find_one({"_id": partial_doc["_id"]})
#             if full_product_doc:
#                 print(
#                     f"DEBUG product_model: Returning single product: {full_product_doc.get('name_primary') or full_product_doc.get('product_name')}")
#                 return product_helper(full_product_doc)
#             else:
#                 print(
#                     f"DEBUG product_model: ERROR! Matched name '{matched_name}' from map, but full doc not found by _id '{partial_doc['_id']}'")
#                 return None
#         else:
#             print(
#                 f"DEBUG product_model: ERROR! Matched name '{matched_name}' not found in product_names_map or _id missing.")
#             return None
#
#     print(f"DEBUG product_model: No single exact match. Trying multiple matches with score >= {list_threshold}.")
#     multiple_best_matches = process.extract(query_name, choices, scorer=scorer_to_use,
#                                             limit=limit * 2 if limit > 0 else 10)
#     print(
#         f"DEBUG product_model: extract (multiple) result for '{query_name}' (before score filter): {multiple_best_matches}")
#
#     matched_products_list = []
#     if multiple_best_matches:
#         for name, score in multiple_best_matches:
#             print(f"DEBUG product_model: Checking match: '{name}' with score {score}")
#             if score >= list_threshold:
#                 print(f"DEBUG product_model: PASSED list_threshold ({score} >= {list_threshold}) for '{name}'")
#                 partial_doc = product_names_map.get(name)
#                 if partial_doc and "_id" in partial_doc:
#                     full_product_doc = products_collection.find_one({"_id": partial_doc["_id"]})
#                     if full_product_doc:
#                         matched_products_list.append(product_helper(full_product_doc))
#                         print(
#                             f"DEBUG product_model: Added to list: {full_product_doc.get('name_primary') or full_product_doc.get('product_name')}")
#                         if len(matched_products_list) >= limit and limit > 0:  # Tôn trọng `limit` gốc
#                             print(f"DEBUG product_model: Reached list limit of {limit}. Breaking.")
#                             break
#                     else:
#                         print(
#                             f"DEBUG product_model: ERROR! Matched name '{name}' from map, but full doc not found by _id '{partial_doc['_id']}' (in multiple matches)")
#                 else:
#                     print(
#                         f"DEBUG product_model: ERROR! Matched name '{name}' not found in product_names_map or _id missing (in multiple matches).")
#             else:
#                 print(
#                     f"DEBUG product_model: FAILED list_threshold ({score} < {list_threshold}) for '{name}'. Further matches will be worse, breaking.")
#                 break
#
#     if not matched_products_list:
#         print(f"DEBUG product_model: No products passed list_threshold for query '{query_name}'. Returning None.")
#         return None
#     else:
#         print(f"DEBUG product_model: Returning list of {len(matched_products_list)} products for query '{query_name}'.")
#         return matched_products_list
#

def get_product_by_name_fuzzy(query_name: str, limit: int = 5,
                              exact_match_threshold: int = 80,
                              list_threshold: int = 65):
    """
    Tìm kiếm sản phẩm theo tên gần đúng, chấp nhận sai sót chính tả và biến thể.
    Bao gồm: product_name, name_primary, brand, uses, description, full_descriptions.
    - exact_match_threshold: Ngưỡng để coi là một kết quả khớp "chính xác" duy nhất.
    - list_threshold: Ngưỡng để đưa sản phẩm vào danh sách các kết quả gần đúng.
    """
    print(f"\nDEBUG product_model: --- Starting get_product_by_name_fuzzy for query: '{query_name}' ---")
    print(
        f"DEBUG product_model: Thresholds: exact={exact_match_threshold}, list={list_threshold}, limit={limit}"
    )

    # Lấy các sản phẩm với các trường liên quan không rỗng
    all_products_cursor = products_collection.find(
        {
            "$or": [
                {"product_name": {"$ne": None, "$ne": ""}},
                {"name_primary": {"$ne": None, "$ne": ""}},
                {"brand": {"$ne": None, "$ne": ""}},
                {"uses": {"$ne": None, "$ne": ""}},
                {"description": {"$ne": None, "$ne": ""}},
                {"full_descriptions": {"$ne": None, "$ne": ""}},
            ]
        },
        {
            "product_name": 1,
            "name_primary": 1,
            "brand": 1,
            "uses": 1,
            "description": 1,
            "full_descriptions": 1,
            "_id": 1,
        }
    )

    # Xây dựng map: key là từng chuỗi để so khớp, value là _id sản phẩm
    match_map = {}
    choices = []
    for p_doc in all_products_cursor:
        # Tập hợp các trường để fuzzy searching
        fields = [
            p_doc.get("name_primary"),
            p_doc.get("product_name"),
            p_doc.get("brand"),
            p_doc.get("uses"),
            p_doc.get("description"),
            p_doc.get("full_descriptions"),
        ]
        for field in fields:
            if field and isinstance(field, str):
                field = field.strip()
                # Đảm bảo không trùng lặp trong choices
                if field and field not in match_map:
                    match_map[field] = {"_id": p_doc["_id"]}
                    choices.append(field)

    print(f"DEBUG product_model: Number of unique choices: {len(choices)}")
    if not choices:
        print("DEBUG product_model: No choices for fuzzy search. Returning None.")
        return None

    # Dùng fuzz.token_set_ratio cho so khớp nội dung tự nhiên
    scorer_to_use = fuzz.token_set_ratio
    print(f"DEBUG product_model: Using scorer: {scorer_to_use.__name__}")

    # 1. Kiểm tra best match duy nhất
    best_match_tuple = process.extractOne(query_name, choices, scorer=scorer_to_use)
    print(f"DEBUG product_model: extractOne result for '{query_name}': {best_match_tuple}")

    if best_match_tuple and best_match_tuple[1] >= exact_match_threshold:
        matched_str = best_match_tuple[0]
        score = best_match_tuple[1]
        print(f"DEBUG product_model: Exact match found! Score {score} >= {exact_match_threshold} for '{matched_str}'")
        partial_doc = match_map.get(matched_str)
        if partial_doc and "_id" in partial_doc:
            full_product_doc = products_collection.find_one({"_id": partial_doc["_id"]})
            if full_product_doc:
                return product_helper(full_product_doc)
            else:
                print("DEBUG product_model: ERROR! Full doc not found by _id.")
                return None
        else:
            print("DEBUG product_model: ERROR! No _id in match_map.")
            return None

    # 2. Nếu không có exact match, trả về list fuzzy theo list_threshold
    multiple_best_matches = process.extract(
        query_name, choices, scorer=scorer_to_use,
        limit=limit * 2 if limit > 0 else 10
    )
    print(f"DEBUG product_model: extract (multiple) result for '{query_name}': {multiple_best_matches}")

    matched_products_list = []
    for field_value, score in multiple_best_matches:
        if score >= list_threshold:
            partial_doc = match_map.get(field_value)
            if partial_doc and "_id" in partial_doc:
                full_product_doc = products_collection.find_one({"_id": partial_doc["_id"]})
                if full_product_doc:
                    matched_products_list.append(product_helper(full_product_doc))
                    if len(matched_products_list) >= limit and limit > 0:
                        break

    if not matched_products_list:
        print(f"DEBUG product_model: No products passed list_threshold for query '{query_name}'. Returning None.")
        return None
    else:
        print(f"DEBUG product_model: Returning list of {len(matched_products_list)} products for query '{query_name}'.")
        return matched_products_list
def find_products_by_keyword(keyword: str, limit: int = 10):
    regex_query = {"$regex": keyword, "$options": "i"}  # "i" for case-insensitive
    query = {
        "$or": [
            {"product_name": regex_query},
            {"name_primary": regex_query},
            {"description": regex_query},
            {"uses": regex_query},
            {"ingredients.ingredient_name": regex_query},
            {"brand": regex_query}
        ]
    }
    products = products_collection.find(query).limit(limit)
    return [product_helper(p) for p in products]


def get_product_inventory(product_id_or_name_query: str):
    product = get_product_by_id(product_id_or_name_query)
    if product and "inventory" in product:
        return product.get("inventory")

    found_product_or_list = get_product_by_name_fuzzy(product_id_or_name_query, limit=1,
                                                      exact_match_threshold=85,  # Có thể giữ 85-90 cho chức năng này
                                                      list_threshold=70)  # Ngưỡng list cũng có thể cao hơn ở đây

    if isinstance(found_product_or_list, dict) and "inventory" in found_product_or_list:
        return found_product_or_list.get("inventory")

    if isinstance(found_product_or_list, list) and found_product_or_list:
        first_product = found_product_or_list[0]
        if "inventory" in first_product:
            pass

    return None


def find_products_by_symptom_keywords(keywords: list[str], limit: int = 5):
    if not keywords or not all(isinstance(kw, str) for kw in keywords):  # Kiểm tra keywords hợp lệ
        return []

    or_conditions = []
    fields_to_search = ["uses", "description", "product_name", "name_primary"]

    for field in fields_to_search:
        for kw in keywords:
            if kw.strip():
                or_conditions.append({field: {"$regex": kw.strip(), "$options": "i"}})

    if not or_conditions:
        return []

    query = {"$or": or_conditions}

    try:
        products = products_collection.find(query).limit(limit)
        return [product_helper(p) for p in products]
    except Exception as e:
        print(f"Error in find_products_by_symptom_keywords: {e}")
        return []


def get_products_by_category(category_slug: str, limit: int = 10):
    if not category_slug or not isinstance(category_slug, str):
        return []

    query = {
        "$or": [
            {"category.main_category_slug": category_slug},
            {"category.sub_category_slug": category_slug},
            {"category.child_category_slug": category_slug}
        ]
    }
    try:
        products = products_collection.find(query).limit(limit)
        return [product_helper(p) for p in products]
    except Exception as e:
        print(f"Error in get_products_by_category: {e}")
        return []
