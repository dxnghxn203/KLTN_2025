from models import product as product_model  # Đổi tên để tránh trùng lặp


async def get_similar_products(product_id: str, limit: int = 5):
    """
    Tìm sản phẩm tương tự.
    Cách đơn giản: dựa trên cùng child_category_id hoặc sub_category_id.
    """
    current_product = product_model.get_product_by_id(product_id)
    if not current_product or "category" not in current_product:
        return []

    category_info = current_product["category"]
    similar_products = []

    if "child_category_slug" in category_info and category_info["child_category_slug"]:
        products = product_model.get_products_by_category(category_info["child_category_slug"], limit=limit + 1)
        similar_products.extend(p for p in products if p["id"] != current_product["id"])

    # Nếu không đủ, tìm ở sub_category
    if len(similar_products) < limit and "sub_category_slug" in category_info and category_info["sub_category_slug"]:
        needed = limit - len(similar_products)
        products = product_model.get_products_by_category(category_info["sub_category_slug"],
                                                          limit=needed + 5)  # Lấy dư để lọc
        for p in products:
            if p["id"] != current_product["id"] and p["id"] not in [sp["id"] for sp in similar_products]:
                similar_products.append(p)
                if len(similar_products) >= limit:
                    break

    return similar_products[:limit]


async def recommend_products_by_symptoms(symptoms_description: str, limit: int = 3):
    """
    Gợi ý sản phẩm dựa trên mô tả triệu chứng.
    Cần một bước xử lý ngôn ngữ tự nhiên để trích xuất keywords từ symptoms_description.
    Ví dụ đơn giản: tách theo khoảng trắng. Nâng cao: dùng thư viện NLP.
    """
    keywords = symptoms_description.lower().split()
    # TODO: Cải thiện việc trích xuất keywords (loại bỏ stop words, stemming,...)

    if not keywords:
        return []

    return product_model.find_products_by_symptom_keywords(keywords, limit=limit)
