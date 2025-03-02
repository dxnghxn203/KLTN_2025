from app.core.database import db

COLECTION_NAME = "products"

async def get_product_by_slug(slug: str):
    try:
        collection = db[COLECTION_NAME]
        return collection.find_one({"slug": slug})
    except Exception as e:
        raise e

