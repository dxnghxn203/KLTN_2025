from bson import ObjectId

from core import logger
from core.mongo import db
from helpers import redis

products_collection = db['products']


def product_helper(product) -> dict:
    if product and "_id" in product:
        product["id"] = str(product["_id"])

    return {
        **{k: str(v) if isinstance(v, ObjectId) else v for k, v in product.items()}
    }


def get_product_by_id(product_id: str):
    product_doc = None
    try:
        product_doc = products_collection.find_one({"product_id": product_id})
        if product_doc:
            return product_helper(product_doc)

    except Exception as e:
        print(f"Error finding product by ID '{product_id}': {e}")

    return None

def get_all_products():
    product_docs = []
    try:
        for product in products_collection.find():
            product_docs.append(product_helper(product))
    except Exception as e:
        print(f"Error getting all products: {e}")
        return []
    return product_docs

async def get_product_by_price_id(product_id: str, price_id: str):
    try:

        product = products_collection.find_one({
            "product_id": product_id,
            "prices.price_id": price_id,
            "is_approved": True,
            "active": True
        },{"_id": 0})


        product["prices"] = [
            price for price in product.get("prices", [])
            if price.get("price_id") == price_id
        ]

        return product_helper(product)
    except Exception as e:
        return None

def check_out_of_stock(product_id: str):
    data = redis.get_product_transaction(product_id=product_id)

    inventory = data.get("inventory", 0)
    sell = data.get("sell", 0)

    logger.info(f"Inventory: {inventory}, Sell: {sell}")
    return inventory <= sell


def search_products_by_text(search_text: str, limit: int = 5) -> list[dict]:
    if not search_text:
        return []

    query = {
        "$text": {
            "$search": search_text
        }
    }

    projection = {
        "score": {
            "$meta": "textScore"
        }
    }

    sort_order = [
        ("score", {"$meta": "textScore"})
    ]

    try:
        product_docs = []
        results = products_collection.find(query, projection).sort(sort_order).limit(limit)
        for product in results:
            product_docs.append(product_helper(product))
        return product_docs
    except Exception as e:
        return []