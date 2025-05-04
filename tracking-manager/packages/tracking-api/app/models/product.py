import asyncio
from starlette import status

from app.core import logger, response, recommendation
from app.core.database import db
from app.core.s3 import upload_file
from app.entities.pharmacist.response import ItemPharmacistRes
from app.entities.product.request import ItemProductDBInReq, ItemImageDBReq, ItemPriceDBReq, ItemProductDBReq, \
    ItemProductRedisReq, UpdateCategoryReq, ItemCategoryDBReq, ApproveProductReq, UpdateProductStatusReq, \
    AddProductMediaReq, DeleteProductMediaReq, ItemUpdateProductReq
from app.entities.product.response import ItemProductDBRes
from app.helpers import redis
from app.helpers.constant import generate_id
from app.models.comment import count_comments
from app.models.review import count_reviews, average_rating

collection_name = "products"
collection_category = "categories"

VALID_MEDIA_TYPES = {"images", "images_primary", "certificate_file"}

async def get_product_by_slug(slug: str):
    try:
        collection = db[collection_name]
        cur = collection.find_one({
            "slug": slug,
            "is_approved": True,
            "active": True
        })
        if cur:
            count_review = await count_reviews(cur["product_id"])
            count_comment = await count_comments(cur["product_id"])
            avg_rating = await average_rating(cur["product_id"])
            return ItemProductDBRes(**cur,
                                   count_review=count_review,
                                   count_comment=count_comment,
                                   rating=avg_rating)
        return None
    except Exception as e:
        raise e

async def get_all_product(page: int, page_size: int):
    try:
        collection = db[collection_name]
        skip_count = (page - 1) * page_size
        product_list = collection.find().skip(skip_count).limit(page_size)
        return [ItemProductDBRes(**product) for product in product_list]
    except Exception as e:
        logger.error(f"Failed [get_all_product]: {e}")
        raise e

async def get_product_top_selling(top_n):
    try:
        result = recommendation.send_request("/v1/top-selling/", {"top_n": top_n})
        product_list = result["data"]

        enriched_products = []

        for product in product_list:
            product_id = product["product_id"]

            count_review, count_comment, avg_rating = await asyncio.gather(
                count_reviews(product_id),
                count_comments(product_id),
                average_rating(product_id)
            )

            product["count_review"] = count_review
            product["count_comment"] = count_comment
            product["rating"] = avg_rating

            enriched_products.append(product)

        result["data"] = enriched_products
        return result
    except Exception as e:
        logger.error(f"Failed [get_product_top_selling]: {e}")
        return response.BaseResponse(
            status="failed",
            message="Internal server error",
        )

async def get_related_product(product_id, top_n=5):
    try:
        result = recommendation.send_request("/v1/related/", {"product_id": product_id, "top_n": top_n})
        product_list = result["data"]

        enriched_products = []

        for product in product_list:
            product_id = product["product_id"]

            count_review, count_comment, avg_rating = await asyncio.gather(
                count_reviews(product_id),
                count_comments(product_id),
                average_rating(product_id)
            )

            product["count_review"] = count_review
            product["count_comment"] = count_comment
            product["rating"] = avg_rating

            enriched_products.append(product)

        result["data"] = enriched_products
        return result
    except Exception as e:
        logger.error(f"Failed [get_related_product]: {e}")
        return response.BaseResponse(
            status="failed",
            message="Internal server error",
        )
async def get_product_by_cart_mongo(product_ids, cart):
    try:
        collection = db[collection_name]
        products = list(collection.find({"product_id": {"$in": product_ids}}, {"_id": 0}))
        detailed_cart = []
        for product in products:
            product_id = product["product_id"]
            cart_item = cart.get(product_id)
            if cart_item:
                price_id = cart_item["price_id"]
                quantity = cart_item["quantity"]

                matching_price = next((p for p in product["prices"] if p["price_id"] == price_id), None)
                if matching_price:
                    detailed_cart.append({"product": ItemProductDBRes(**product), "price_id": price_id, "quantity": quantity})

        return detailed_cart

    except Exception as e:
        logger.error(f"Failed [get_product_by_cart_mongo]: {e}")
        return []

async def get_product_by_cart_id(product_ids, cart):
    try:
        collection = db[collection_name]
        products = list(collection.find({
            "product_id": {"$in": product_ids},
            "is_approved": True,
            "active": True
        }, {"_id": 0}))
        detailed_cart = []
        for cart_item in cart:
            product_id = cart_item["product_id"]
            price_id = cart_item["price_id"]
            quantity = cart_item["quantity"]

            product = next((p for p in products if p["product_id"] == product_id), None)
            if not product:
                continue

            matching_price = next((p for p in product.get("prices", []) if p["price_id"] == price_id), None)
            if matching_price:
                detailed_cart.append({
                    "product": ItemProductDBRes(**product),
                    "price_id": price_id,
                    "quantity": quantity
                })

        return detailed_cart

    except Exception as e:
        logger.error(f"Failed [get_product_by_cart_id]: {e}")
        return []

async def get_product_by_list_id(product_ids):
    try:
        collection = db[collection_name]
        product_list = collection.find({
            "product_id": {"$in": product_ids},
            "is_approved": True,
            "active": True
        })
        enriched_products = []

        for prod in product_list:
            product_id = prod["product_id"]
            count_review, count_comment, avg_rating = await asyncio.gather(
                count_reviews(product_id),
                count_comments(product_id),
                average_rating(product_id),
            )

            enriched_products.append(
                ItemProductDBRes(
                    **prod,
                    count_review=count_review,
                    count_comment=count_comment,
                    rating=avg_rating
                )
            )
        return enriched_products
    except Exception as e:
        logger.error(f"Failed [get_product_by_list_id]: {e}")
        return []

async def get_product_featured(main_category_id, sub_category_id=None, child_category_id=None,  top_n=5):
    try:
        params = {
            "main_category_id": main_category_id,
            "sub_category_id": sub_category_id,
            "child_category_id": child_category_id,
            "top_n": top_n
        }
        filtered_params = {k: v for k, v in params.items() if v is not None}

        result = recommendation.send_request("/v1/featured/", filtered_params)
        product_list = result["data"]

        enriched_products = []

        for product in product_list:
            product_id = product["product_id"]

            count_review, count_comment, avg_rating = await asyncio.gather(
                count_reviews(product_id),
                count_comments(product_id),
                average_rating(product_id)
            )

            product["count_review"] = count_review
            product["count_comment"] = count_comment
            product["rating"] = avg_rating

            enriched_products.append(product)

        result["data"] = enriched_products
        return result

    except Exception as e:
        logger.error(f"Failed [get_featured]: {e}")
        return response.BaseResponse(
            status="failed",
            message="Internal server error",
        )

async def add_product_db(item: ItemProductDBInReq, images_primary, images, certificate_file=None):
    try:
        collection = db[collection_name]
        cur = collection.find_one({"slug": item.slug})
        if cur:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message=f"Sản phẩm đã tồn tại: {item.slug}"
            )

        certificate_url = (upload_file(certificate_file, "certificates") or "") if certificate_file else ""

        image_list = []
        if images:
            image_list = [
                ItemImageDBReq(
                    images_id=generate_id("IMAGE"),
                    images_url=file_url,
                ) for idx, img in enumerate(images or []) if (file_url := upload_file(img, "images"))
            ]
        logger.info(f"{image_list}")

        price_list = []
        if item.prices and item.prices.prices:
            price_list = [
                ItemPriceDBReq(
                    price_id=generate_id("PRICE"),
                    price=price.original_price*(100-price.discount)/100,
                    discount=price.discount,
                    unit=price.unit,
                    weight=price.weight,
                    amount=price.amount,
                    original_price=price.original_price
                ) for idx, price in enumerate(item.prices.prices)
            ]

        ingredients_list = item.ingredients.ingredients if item.ingredients and item.ingredients.ingredients else []
        full_subscription_list = item.full_description.full_descriptions if item.full_description and item.full_description.full_descriptions else []
        images_primary_url = (upload_file(images_primary, "images_primary") or "") if images_primary else ""

        product_id = generate_id("PRODUCT")

        category_collection = db[collection_category]
        main_category = category_collection.find_one({"main_category_id": item.category.main_category_id})
        if not main_category:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục chính không hợp lệ"
            )

        sub_category = next(
            (sub for sub in main_category.get("sub_category", []) if sub["sub_category_id"] == item.category.sub_category_id),
            None
        )
        if not sub_category:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục phụ không hợp lệ"
            )

        child_category = next(
            (child for child in sub_category.get("child_category", []) if
             child["child_category_id"] == item.category.child_category_id),
            None
        )
        if not child_category:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục con không hợp lệ"
            )

        category_obj = ItemCategoryDBReq(
            main_category_id=item.category.main_category_id,
            main_category_name=main_category.get("main_category_name", ""),
            main_category_slug=main_category.get("main_category_slug", ""),
            sub_category_id=item.category.sub_category_id,
            sub_category_name=sub_category.get("sub_category_name", ""),
            sub_category_slug=sub_category.get("sub_category_slug", ""),
            child_category_id=item.category.child_category_id,
            child_category_name=child_category.get("child_category_name", ""),
            child_category_slug=child_category.get("child_category_slug", ""),
        )

        item_data = ItemProductDBReq(
            **{k: v for k, v in dict(item).items() if k not in ["prices", "ingredients", "category"]},
            product_id=product_id,
            prices=price_list,
            images=image_list,
            full_descriptions=full_subscription_list,
            ingredients=ingredients_list,
            images_primary=images_primary_url,
            category=category_obj,
            certificate_file=certificate_url
        )

        insert_result = collection.insert_one(item_data.dict())

        logger.info(f"Thêm sản phẩm thành công: {insert_result.inserted_id}")

        redis_product = ItemProductRedisReq(inventory=item.inventory)
        redis.save_product(redis_product, product_id)
        logger.info(f"Đã lưu sản phẩm vào Redis với key: {product_id}")

    except Exception as e:
        logger.error(f"Lỗi khi thêm sản phẩm: {e}")
        raise e

async def update_product_category(item: UpdateCategoryReq):
    try:
        collection = db[collection_name]
        category_collection = db[collection_category]
        product = collection.find_one({"product_id": item.product_id})

        if not product:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Không tìm thấy sản phẩm"
            )

        main_category = category_collection.find_one({"main_category_id": item.main_category_id})
        if not main_category:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục chính không hợp lệ"
            )

        sub_category = next(
            (sub for sub in main_category.get("sub_category", []) if sub["sub_category_id"] == item.sub_category_id),
            None
        )
        if not sub_category:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục phụ không hợp lệ"
            )

        child_category = next(
            (child for child in sub_category.get("child_category", []) if
             child["child_category_id"] == item.child_category_id),
            None
        )
        if not child_category:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Danh mục con không hợp lệ"
            )

        update_data = {
            "category.main_category_id": item.main_category_id,
            "category.main_category_name": main_category.get("main_category_name", ""),
            "category.main_category_slug": main_category.get("main_category_slug", ""),

            "category.sub_category_id": item.sub_category_id,
            "category.sub_category_name": sub_category.get("sub_category_name", ""),
            "category.sub_category_slug": sub_category.get("sub_category_slug", ""),

            "category.child_category_id": item.child_category_id,
            "category.child_category_name": child_category.get("child_category_name", ""),
            "category.child_category_slug": child_category.get("child_category_slug", ""),
        }

        collection.update_one({"product_id": item.product_id}, {"$set": update_data})
        logger.info(f"Updated category names for product_id: {item.product_id}")

        return response.SuccessResponse(message="Cập nhật danh mục thành công")
    except Exception as e:
        logger.error(f"Error updating product category: {str(e)}")
        raise e

async def delete_product(product_id: str):
    try:
        collection = db[collection_name]
        product = collection.find_one({"product_id": product_id})
        if not product:
            logger.info(f"Product not found for product_id: {product_id}")
        else:
            product = ItemProductDBRes(**product)
            delete_result = collection.delete_one({"product_id": product.product_id})
            if delete_result.deleted_count == 0:
                logger.info(f"Product not deleted for product_id: {product_id}")

        redis.delete_product(product_id)
        logger.info(f"Đã xóa sản phẩm vào Redis với key: {product_id}")

        return response.SuccessResponse(message="Xóa sản phẩm thành công")
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise e

async def get_product_by_id(product_id: str, price_id: str):
    try:
        collection = db[collection_name]

        product = collection.find_one({
            "product_id": product_id,
            "prices.price_id": price_id,
            "is_approved": True,
            "active": True
        },{"_id": 0})

        if not product:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )

        product["prices"] = [
            price for price in product.get("prices", [])
            if price.get("price_id") == price_id
        ]

        return ItemProductDBRes(**product)
    except Exception as e:
        logger.error(f"Error getting product by id: {str(e)}")
        raise e

async def restore_product_sell(product_id: str, price_id: str, quantity: int):
    try:
        collection = db[collection_name]

        result = collection.update_one(
            {"product_id": product_id, "prices.price_id": price_id},
            {"$inc": {"prices.$.sell": -quantity}}
        )
        if result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found or quantity not updated"
            )
        logger.info(f"Product sell restored successfully for product_id: {product_id}, price_id: {price_id}")
    except Exception as e:
        logger.error(f"Error restoring product sell: {str(e)}")
        raise e

async def get_product_best_deals(top_n: int):
    try:
        result = recommendation.send_request("/v1/top-selling/", {"top_n": top_n})
        product_list = result.get("data", [])

        enriched_products = []

        for product in product_list:
            product_id = product["product_id"]

            count_review, count_comment, avg_rating = await asyncio.gather(
                count_reviews(product_id),
                count_comments(product_id),
                average_rating(product_id)
            )

            prices = product.get("prices", [])
            max_discount = max([p.get("discount", 0) for p in prices]) if prices else 0

            product.update({
                "count_review": count_review,
                "count_comment": count_comment,
                "rating": avg_rating,
                "max_discount_percent": max_discount
            })

            enriched_products.append(product)

        sorted_products = sorted(
            enriched_products,
            key=lambda x: (
                -x.get("max_discount_percent", 0)  # discount giảm dần
                -(x.get("rating") or 0),              # review giảm dần
            )
        )

        return response.BaseResponse(
            status="success",
            message="Best deal products retrieved successfully",
            data=sorted_products[:top_n]
        )

    except Exception as e:
        logger.error(f"Failed [get_product_best_deals]: {e}")
        return response.BaseResponse(
            status="failed",
            message="Internal server error"
        )

async def approve_product(item: ApproveProductReq, pharmacist: ItemPharmacistRes):
    try:
        collection = db[collection_name]
        product = collection.find_one({"product_id": item.product_id})
        if not product:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )
        product_info = ItemProductDBRes(**product)
        if product_info.is_approved:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Product already approved"
            )
        if product_info.verified_by and product_info.verified_by != pharmacist.email:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="You are not authorized to approve this product"
            )
        collection.update_one({
            "product_id": item.product_id},
            {"$set": {
                "is_approved": item.is_approved,
                "verified_by": pharmacist.email,
                "rejected_note": item.rejected_note,
                "pharmacist_name": pharmacist.user_name
            }
        })
        logger.info(f"Product approved successfully for {item.product_id} by {verified_by} with: {item.is_approved}")

        return response.SuccessResponse(message="Product approved successfully")
    except Exception as e:
        logger.error(f"Error approving product: {str(e)}")
        raise e

async def get_approved_product(email: str):
    try:
        collection = db[collection_name]
        product_list = collection.find({"verified_by": {"$in": [None, "", email]}})
        logger.info(f"{product_list}")
        return [ItemProductDBRes(**product) for product in product_list]
    except Exception as e:
        logger.error(f"Failed [get_not_approved_product]: {e}")
        raise e

async def update_product_status(item: UpdateProductStatusReq):
    try:
        collection = db[collection_name]
        collection.update_one({"product_id": item.product_id},{"$set": {"active": item.status}})
        return response.SuccessResponse(message="Product status updated successfully")
    except Exception as e:
        logger.error(f"Error updating product status: {str(e)}")
        raise e

async def add_product_media(item: AddProductMediaReq, files):
    try:
        media_type = item.media_type.lower()
        if media_type not in VALID_MEDIA_TYPES:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Loại media không hợp lệ")

        if not files or len(files) == 0:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="File không hợp lệ")

        collection = db[collection_name]
        product = collection.find_one({"product_id": item.product_id})
        if not product:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Không tìm thấy sản phẩm")

        if files:
            if media_type == "images":
                new_images = [
                    {
                        "images_id": generate_id("IMAGE"),
                        "images_url": upload_file(file, "images")
                    } for file in files if upload_file(file, "images")
                ]
                collection.update_one(
                    {"product_id": item.product_id},
                    {"$push": {"images": {"$each": new_images}}}
                )
            elif media_type == "images_primary":
                file = files[0] if files else None
                url = upload_file(file, "images_primary") if file else ""
                collection.update_one(
                    {"product_id": item.product_id},
                    {"$set": {"images_primary": url}}
                )
            elif media_type == "certificate_file":
                file = files[0] if files else None
                url = upload_file(file, "certificates") if file else ""
                collection.update_one(
                    {"product_id": item.product_id},
                    {"$set": {"certificate_file": url}}
                )
            else:
                raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Loại media không hợp lệ")
        return response.SuccessResponse(message="Thêm media thành công")
    except Exception as e:
        logger.error(f"Error adding product media: {str(e)}")
        raise e

async def delete_product_media(item: DeleteProductMediaReq):
    try:
        media_type = item.media_type.lower()
        if media_type not in VALID_MEDIA_TYPES:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Loại media không hợp lệ")

        if not item.target_urls:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Danh sách URL cần xóa không hợp lệ")

        collection = db[collection_name]
        product = collection.find_one({"product_id": item.product_id})
        if not product:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Không tìm thấy sản phẩm")

        if media_type == "images":
            for url in item.target_urls:
                collection.update_one(
                    {"product_id": item.product_id},
                    {"$pull": {"images": {"images_url": url}}}
                )
        elif media_type == "images_primary":
            if product.get("images_primary") in item.target_urls:
                collection.update_one(
                    {"product_id": item.product_id},
                    {"$set": {"images_primary": ""}}
                )
        elif media_type == "certificate_file":
            if product.get("certificate_file") in item.target_urls:
                collection.update_one(
                    {"product_id": item.product_id},
                    {"$set": {"certificate_file": ""}}
                )
        else:
            raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Loại media không hợp lệ")
        return response.SuccessResponse(message="Xóa media thành công")
    except Exception as e:
        logger.error(f"Error deleting product media: {str(e)}")
        raise e

async def update_product_fields(update_data: ItemUpdateProductReq):
    try:
        collection = db[collection_name]
        product = collection.find_one({"product_id": update_data.product_id})
        if not product:

            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy sản phẩm"
            )

        collection = db[collection_name]
        cur = collection.find_one({
            "slug": update_data.slug,
            "product_id": {"$ne": update_data.product_id}
        })
        if cur:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message=f"Sản phẩm đã tồn tại với slug: {update_data.slug}"
            )

        update_fields = {}

        for field in [
            "product_name", "name_primary", "inventory", "slug", "description", "origin",
            "uses", "dosage", "side_effects", "precautions", "storage", "dosage_form", "brand",
            "prescription_required", "registration_number", "full_description"
        ]:
            value = getattr(update_data, field, None)
            if value is not None:
                update_fields[field] = value

        if update_data.prices and update_data.prices.prices:
            update_fields["prices"] = [
                ItemPriceDBReq(
                    price_id=generate_id("PRICE"),
                    price=price.original_price * (100 - price.discount) / 100,
                    discount=price.discount,
                    unit=price.unit,
                    weight=price.weight,
                    amount=price.amount,
                    original_price=price.original_price,
                ).dict()
                for price in update_data.prices.prices
            ]

        if update_data.ingredients and update_data.ingredients.ingredients:
            update_fields["ingredients"] = [i.dict() for i in update_data.ingredients.ingredients]

        if update_data.manufacturer:
            update_fields["manufacturer"] = update_data.manufacturer.dict()

        if update_data.category:
            category_collection = db[collection_category]
            main_category = category_collection.find_one({"main_category_id": update_data.category.main_category_id})
            if not main_category:
                raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Danh mục chính không hợp lệ")

            sub_category = next(
                (sub for sub in main_category.get("sub_category", []) if sub["sub_category_id"] == update_data.category.sub_category_id),
                None
            )
            if not sub_category:
                raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Danh mục phụ không hợp lệ")

            child_category = next(
                (child for child in sub_category.get("child_category", []) if child["child_category_id"] == update_data.category.child_category_id),
                None
            )
            if not child_category:
                raise response.JsonException(status_code=status.HTTP_400_BAD_REQUEST, message="Danh mục con không hợp lệ")

            category_obj = ItemCategoryDBReq(
                main_category_id=update_data.category.main_category_id,
                main_category_name=main_category.get("main_category_name", ""),
                main_category_slug=main_category.get("main_category_slug", ""),
                sub_category_id=update_data.category.sub_category_id,
                sub_category_name=sub_category.get("sub_category_name", ""),
                sub_category_slug=sub_category.get("sub_category_slug", ""),
                child_category_id=update_data.category.child_category_id,
                child_category_name=child_category.get("child_category_name", ""),
                child_category_slug=child_category.get("child_category_slug", "")
            )
            update_fields["category"] = category_obj.dict()

        if update_fields:
            update_fields.update({
                "is_approved": False,
                "verified_by": "",
                "rejected_note": ""
            })
            collection.update_one({"product_id": update_data.product_id}, {"$set": update_fields})

        return response.SuccessResponse(message="Cập nhật sản phẩm thành công")
    except Exception as e:
        logger.error(f"Error updating product fields: {str(e)}")
        raise e

async def update_pharmacist_name_for_all_products():
    product_collection = db[collection_name]
    pharmacist_collection = db["pharmacists"]

    cursor = product_collection.find({
        "verified_by": {"$ne": ""}
    })

    updated_count = 0
    for product in cursor:
        email = product.get("verified_by")
        if not email:
            continue

        pharmacist = pharmacist_collection.find_one({"email": email})
        if not pharmacist:
            continue

        pharmacist_name = pharmacist.get("user_name", "")
        if not pharmacist_name:
            continue

        product_collection.update_one(
            {"_id": product["_id"]},
            {"$set": {"pharmacist_name": pharmacist_name}}
        )
        updated_count += 1

    return updated_count
