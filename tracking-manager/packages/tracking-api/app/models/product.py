from datetime import datetime

from app.core.database import db
from app.core.s3 import upload_file
from app.entities.product.request import ItemProductDBInReq, ItemImageDBReq, ItemPriceDBReq, ItemProductDBReq, \
    ItemProductRedisReq
from app.helpers import redis
from app.helpers.constant import generate_random_string, generate_id
from app.middleware.logging import logger

COLECTION_NAME = "products"

async def get_product_by_slug(slug: str):
    try:
        collection = db[COLECTION_NAME]
        return collection.find_one({"slug": slug})
    except Exception as e:
        raise e

async def add_product_db(item: ItemProductDBInReq, images_primary, images):
    try:
        image_list = [
            ItemImageDBReq(
                images_id=generate_id("IMAGE"),
                images_url=file_url,
            ) for idx, img in enumerate(images or []) if (file_url := upload_file(img, "images"))
        ]

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
        images_primary_url = upload_file(images_primary, "images_primary") or ""

        product_id = generate_id("PRODUCT")

        item_data = ItemProductDBReq(
            **{k: v for k, v in dict(item).items() if k not in ["prices", "ingredients"]},
            product_id=product_id,
            prices=price_list,
            images=image_list,
            ingredients=ingredients_list,
            images_primary=images_primary_url
        )

        collection = db[COLECTION_NAME]
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
