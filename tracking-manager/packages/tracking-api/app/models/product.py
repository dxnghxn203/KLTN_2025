from datetime import datetime

from app.core.database import db
from app.entities.product.request import ItemProductDBInReq, ItemImageDBReq, ItemPriceDBReq, \
    ItemCategoryDBReq, ItemProductDBReq
from app.helpers.constant import generate_random_string
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
        timestamp = int(datetime.utcnow().timestamp())
        random_id = generate_random_string(5)
        image_list = [
            ItemImageDBReq(
                id=f"images_{random_id}_{timestamp}_{idx}",
            ) for idx, img in enumerate(images or [])
        ]

        price_list = []
        if item.prices and item.prices.prices:
            price_list = [
                ItemPriceDBReq(
                    id=f"price_{random_id}_{timestamp}_{idx}",
                    price=price.price,
                    original_price=price.original_price,
                    unit_price=price.unit_price,
                    discount=price.discount,
                    unit=price.unit
                ) for idx, price in enumerate(item.prices.prices)
            ]

        category = ItemCategoryDBReq(
            id=f"category_{random_id}_{timestamp}",
            name=item.category.name if item.category else "",
            slug=item.category.slug if item.category else ""
        )

        ingredients_list = item.ingredients.ingredients if item.ingredients and item.ingredients.ingredients else []

        item_data = ItemProductDBReq(
            **{k: v for k, v in dict(item).items() if k not in ["prices", "category", "ingredients"]},
            prices=price_list,
            images=image_list,
            category=category,
            ingredients=ingredients_list
        )

        collection = db[COLECTION_NAME]
        insert_result = collection.insert_one(item_data.dict())

        logger.info(f"Thêm sản phẩm thành công: {insert_result.inserted_id}")

    except Exception as e:
        logger.error(f"Lỗi khi thêm sản phẩm: {e}")
        raise e

