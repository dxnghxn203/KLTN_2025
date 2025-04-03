
from app.core import logger, response, recommendation
from app.core.database import db
from app.entities.cart.response import CartResponse, ItemCartReq

collection_name = "carts"

async def get_cart_mongo(user_id: str):
    try:
        collection = db[collection_name]
        cart_data = collection.find_one({"user_id": user_id})
        if cart_data is None:
            collection.insert_one({"user_id": user_id, "products": []})
        cart = []
        for item in cart_data["products"]:
            product = {
                "product_id": item["product_id"],
                "price_id": item["price_id"],
                "quantity": item["quantity"]
            }
            cart.append(product)
        return cart
    except Exception as e:
        logger.error(f"Error getting cart data: {e}")
        return None

async def get_product_ids(user_id: str):
    try:
        collection = db[collection_name]
        cart_data = collection.find_one({"user_id": user_id})
        if cart_data:
            products = [item["product_id"] for item in cart_data["products"]]
            return products
        return None
    except Exception as e:
        logger.error(f"Error getting product IDs from cart: {e}")
        return None

async def add_product_to_cart(user_id:str, product_id: str,price_id:str, quantity: int):
    try:
        item = {
            "product_id": product_id,
            "price_id": price_id,
            "quantity": quantity
        }
        collection = db[collection_name]
        filter_query = {"user_id": user_id, "products.product_id": product_id}

        existing_product = collection.find_one(filter_query)

        if existing_product:
            update_query = {
                "$set": {"products.$.price_id": price_id},
                "$inc": {"products.$.quantity": quantity}
            }
        else:
            update_query = {
                "$push": {"products": item}
            }
        collection.update_one({"user_id": user_id}, update_query, upsert=True)
        return response.BaseResponse(
            status="success",
            message="Product added to cart successfully"
        )
    except Exception as e:
        logger.error(f"Error adding product to cart: {e}")
        return response.BaseResponse(
            status="error",
            message="Failed to add product to cart",
            data=None
        )

def remove_product_from_cart(user_id: str, product_id: str):
    try:
        collection = db[collection_name]
        cart_data = collection.find_one({"user_id": user_id})
        if cart_data:
            cart_data["products"] = [item for item in cart_data["products"] if item["product_id"] != product_id]
            collection.update_one({"user_id": user_id}, {"$set": {"products": cart_data["products"]}})
            return response.BaseResponse(
                status="success",
                message="Product removed from cart successfully"
            )
        else:
            return response.BaseResponse(
                status="error",
                message="Cart not found",
                data=None
            )
    except Exception as e:
        logger.error(f"Error removing product from cart: {e}")
        return response.BaseResponse(
            status="error",
            message="Failed to remove product from cart",
            data=None
        )