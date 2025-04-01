from starlette import status

from app.core import logger, response, recommendation
from app.core.database import db
from app.core.s3 import upload_file
from app.entities.product.request import ItemProductDBInReq, ItemImageDBReq, ItemPriceDBReq, ItemProductDBReq, \
    ItemProductRedisReq, UpdateCategoryReq
from app.entities.product.response import ItemProductDBRes
from app.helpers import redis
from app.helpers.constant import generate_id

collection_name = "products"

async def get_product_by_slug(slug: str):
    try:
        collection = db[collection_name]
        cur = collection.find_one({"slug": slug})
        if cur:
            return ItemProductDBRes(**cur)
        return None
    except Exception as e:
        raise e

async def get_all_product(page: int, pageSize: int):
    try:
        collection = db[collection_name]
        skip_count = (page - 1) * pageSize
        product_list = collection.find().skip(skip_count).limit(pageSize)
        return [ItemProductDBRes(**product) for product in product_list]
    except Exception as e:
        logger.error(f"Failed [get_all_product]: {e}")
        raise e

async def get_product_top_selling(top_n):
    try:
        return recommendation.send_request("/v1/top-selling/", {"top_n": top_n})
    except Exception as e:
        logger.error(f"Failed [get_product_top_selling]: {e}")
        return response.BaseResponse(
            status="failed",
            message="Internal server error",
        )

async def get_product_by_list_id(product_ids):
    try:
        collection = db[collection_name]
        product_list = collection.find({"product_id": {"$in": product_ids}})
        return [ItemProductDBRes(**product) for product in product_list]
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

        return recommendation.send_request("/v1/featured/", filtered_params)
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
                    amount=price.amount,
                    amount_per_unit=price.amount_per_unit
                ) for idx, price in enumerate(item.prices.prices)
            ]

        ingredients_list = item.ingredients.ingredients if item.ingredients and item.ingredients.ingredients else []
        images_primary_url = (upload_file(images_primary, "images_primary") or "") if images_primary else ""

        product_id = generate_id("PRODUCT")

        item_data = ItemProductDBReq(
            **{k: v for k, v in dict(item).items() if k not in ["prices", "ingredients"]},
            product_id=product_id,
            prices=price_list,
            images=image_list,
            ingredients=ingredients_list,
            images_primary=images_primary_url
        )

        collection = db[collection_name]
        insert_result = collection.insert_one(item_data.dict())

        logger.info(f"Thêm sản phẩm thành công: {insert_result.inserted_id}")

        for price in price_list:
            redis_id = f"{product_id}_{price.price_id}"
            redis_product = ItemProductRedisReq(inventory=price.amount)
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
            return response.JsonException(
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
            return response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )

        product = ItemProductDBRes(**product)

        delete_result = collection.delete_one({"product_id": product.product_id})
        if delete_result.deleted_count == 0:
            return response.JsonException(
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