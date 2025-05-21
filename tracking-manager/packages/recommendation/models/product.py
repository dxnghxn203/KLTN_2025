from typing import Optional, List, Dict, Any

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


async def get_product_inventory(product_id: str, price_id: str):
    try:
        inventory_collection = db["products_inventory"]
        inventory_doc = inventory_collection.find_one({
            "product_id": product_id,
            "price_id": price_id
        })

        if not inventory_doc:
            return None

        return inventory_doc

    except Exception as e:
        logger.error(f"Error getting product inventory: {str(e)}")
        raise e

def check_out_of_stock(product_id: str, price_id: str):
    try:
        inventory_data = get_product_inventory(product_id=product_id, price_id=price_id)

        if not inventory_data:
            return None

        inventory = inventory_data.get("inventory", 0)
        sell = inventory_data.get("sell", 0)

        return inventory <= sell
    except Exception as e:
        logger.error(f"Error checking out of stock for product ID {product_id}: {e}")
        return None


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
        logger.error(f"Error searching products by text '{search_text}': {e}")
        return []

#recommendation
async def get_all_products_recommendation() -> List[Dict[str, Any]]:
    """
    Lấy tất cả sản phẩm từ MongoDB cho hệ thống gợi ý
    """
    try:
        products = db.products.find({"active": True}).to_list(length=None)
        return [product_helper(p) for p in products]
    except Exception as e:
        logger.error(f"Error fetching all products for recommendation: {str(e)}")
        return []

async def get_product_by_id_recommendation(product_id: str) -> Optional[Dict[str, Any]]:
    """
    Lấy thông tin sản phẩm theo ID cho hệ thống gợi ý
    """
    try:
        product = db.products.find_one({"product_id": product_id})
        if product:
            return product_helper(product)
        return None
    except Exception as e:
        logger.error(f"Error fetching product by ID {product_id} for recommendation: {str(e)}")
        return None

async def get_products_by_category_recommendation(category_slug: str) -> List[Dict[str, Any]]:
    """
    Lấy sản phẩm theo danh mục
    """
    try:
        products = db.products.find({
            "active": True,
            "$or": [
                {"category.main_category_slug": category_slug},
                {"category.sub_category_slug": category_slug},
                {"category.child_category_slug": category_slug}
            ]
        }).to_list(length=None)
        return products
    except Exception as e:
        logger.error(f"Error fetching products by category {category_slug}: {str(e)}")
        return []

async def get_products_with_discount_recommendation(min_discount: int = 10) -> List[Dict[str, Any]]:
    """
    Lấy sản phẩm có khuyến mãi từ mức nhất định
    """
    try:
        products = db.products.find({
            "active": True,
            "prices": {
                "$elemMatch": {
                    "discount": {"$gte": min_discount}
                }
            }
        }).to_list(length=None)
        return products
    except Exception as e:
        logger.error(f"Error fetching products with discount: {str(e)}")
        return []

async def get_newest_products_recommendation(limit: int = 20) -> List[Dict[str, Any]]:
    """
    Lấy sản phẩm mới nhất
    """
    try:
        products = db.products.find({"active": True}).sort("created_at", -1).limit(limit).to_list(length=limit)
        return products
    except Exception as e:
        logger.error(f"Error fetching newest products: {str(e)}")
        return []