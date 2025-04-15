import asyncio

from starlette import status

from app.core import logger, response, recommendation
from app.core.database import db
from app.core.s3 import upload_file
from app.entities.product.request import ItemProductDBInReq, ItemImageDBReq, ItemPriceDBReq, ItemProductDBReq, \
    ItemProductRedisReq, UpdateCategoryReq
from app.entities.product.response import ItemProductDBRes
from app.helpers import redis
from app.helpers.constant import generate_id
from app.models.comment import count_comments
from app.models.review import count_reviews, average_rating

collection_name = "products"

async def get_product_by_slug(slug: str):
    try:
        collection = db[collection_name]
        cur = collection.find_one({"slug": slug})
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
        products = list(collection.find({"product_id": {"$in": product_ids}}, {"_id": 0}))
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
        product_list = collection.find({"product_id": {"$in": product_ids}})
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

async def add_product_db(item: ItemProductDBInReq, images_primary, images):
    try:
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
                    original_price=price.original_price,
                    unit_price=price.unit_price,
                    discount=price.discount,
                    unit=price.unit,
                    inventory=price.inventory,
                    amount_per_unit=price.amount_per_unit,
                    weight=price.weight
                ) for idx, price in enumerate(item.prices.prices)
            ]

        ingredients_list = item.ingredients.ingredients if item.ingredients and item.ingredients.ingredients else []
        full_subscription_list = item.full_description.full_descriptions if item.full_description and item.full_description.full_descriptions else []
        images_primary_url = (upload_file(images_primary, "images_primary") or "") if images_primary else ""

        product_id = generate_id("PRODUCT")

        item_data = ItemProductDBReq(
            **{k: v for k, v in dict(item).items() if k not in ["prices", "ingredients"]},
            product_id=product_id,
            prices=price_list,
            images=image_list,
            full_descriptions=full_subscription_list,
            ingredients=ingredients_list,
            images_primary=images_primary_url
        )

        collection = db[collection_name]
        insert_result = collection.insert_one(item_data.dict())

        logger.info(f"Thêm sản phẩm thành công: {insert_result.inserted_id}")

        for price in price_list:
            redis_id = f"{product_id}_{price.price_id}"
            redis_product = ItemProductRedisReq(inventory=price.inventory)
            redis.save_product(redis_product, redis_id)
            logger.info(f"Đã lưu sản phẩm vào Redis với key: {redis_id}")

    except Exception as e:
        logger.error(f"Lỗi khi thêm sản phẩm: {e}")
        raise e

async def update_product_category(item: UpdateCategoryReq):
    try:
        collection = db[collection_name]
        product = collection.find_one({"product_id": item.product_id})

        if not product:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )

        if "category" not in product:
            product["category"] = {}

        update_data = {
            "category.main_category_name": item.main_category_name,
            "category.sub_category_name": item.sub_category_name,
            "category.child_category_name": item.child_category_name,
        }

        collection.update_one({"product_id": item.product_id}, {"$set": update_data})
        logger.info(f"Updated category names for product_id: {item.product_id}")

        return response.SuccessResponse(message="Product category updated successfully")
    except Exception as e:
        logger.error(f"Error updating product category: {str(e)}")
        raise e

async def delete_product(product_id: str):
    try:
        collection = db[collection_name]
        product = collection.find_one({"product_id": product_id})
        if not product:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )

        product = ItemProductDBRes(**product)

        delete_result = collection.delete_one({"product_id": product.product_id})
        if delete_result.deleted_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Failed to delete product"
            )

        for price in product.prices:
            redis_id = f"{product.product_id}_{price.price_id}"
            redis.delete_product(redis_id)
            logger.info(f"Đã xóa sản phẩm vào Redis với key: {redis_id}")

        return response.SuccessResponse(message="Product deleted successfully")
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise e

async def get_product_by_id(product_id: str, price_id: str):
    try:
        collection = db[collection_name]

        product = collection.find_one(
            {"product_id": product_id, "prices.price_id": price_id},
            {"_id": 0}
        )

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
