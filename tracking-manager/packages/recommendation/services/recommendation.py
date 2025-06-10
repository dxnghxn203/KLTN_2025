from core.mongo import db
from core import logger
from core.redis import redis_client
from models import product as product_model
from models import order as order_model
from models import user as user_model
from models import review as review_model
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import re
import asyncio

from models.product import product_helper

CACHE_EXPIRY = {
    "top_selling": 3 * 3600,
    "related": 24 * 3600,
    "deals": 6 * 3600,
    "featured": 12 * 3600
}

_similarity_matrix = None
_product_indices = None
_product_data = None


async def get_top_selling_products(limit: int = 10, time_window_days: int = 30) -> List[Dict[str, Any]]:
    cache_key = f"top_selling:{limit}:{time_window_days}"

    try:
        cached_result = redis_client.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for {cache_key}")
            return pickle.loads(cached_result)
    except Exception as e:
        logger.warn(f"Redis error when getting top selling from cache: {str(e)}")

    try:
        purchase_counts = await order_model.get_product_purchase_counts_recommendation(days=time_window_days)

        sorted_products = sorted(purchase_counts.items(), key=lambda x: x[1], reverse=True)
        top_product_ids = [product_id for product_id, _ in sorted_products[:limit * 2]]

        if len(top_product_ids) < limit:
            logger.info("Not enough sales data, supplementing with newest products")
            newest_products = await product_model.get_newest_products_recommendation(limit=limit)
            for product in newest_products:
                if product["product_id"] not in top_product_ids:
                    top_product_ids.append(product["product_id"])
                    if len(top_product_ids) >= limit:
                        break

        result = []
        for product_id in top_product_ids[:limit]:
            product = await product_model.get_product_by_id_recommendation(product_id)
            if product:
                product["sold_count"] = purchase_counts.get(product_id, 0)
                product["is_supplemented"] = product_id not in purchase_counts
                processed_product = product_helper(product)
                result.append(processed_product)

        try:
            redis_client.setex(cache_key, CACHE_EXPIRY["top_selling"], pickle.dumps(result))
        except Exception as e:
            logger.warn(f"Redis error when caching top selling: {str(e)}")

        return result
    except Exception as e:
        logger.error(f"Error getting top selling products: {str(e)}")
        return []

async def build_similarity_matrix():

    global _similarity_matrix, _product_indices, _product_data

    try:
        try:
            cached_matrix = redis_client.get("similarity_matrix")
            cached_indices = redis_client.get("product_indices")
            cached_data = redis_client.get("product_data")

            if cached_matrix and cached_indices and cached_data:
                logger.info("Loading similarity matrix from cache")
                _similarity_matrix = pickle.loads(cached_matrix)
                _product_indices = pickle.loads(cached_indices)
                _product_data = pickle.loads(cached_data)
                return
        except Exception as e:
            logger.warn(f"Redis error when loading similarity matrix: {str(e)}")

        logger.info("Building similarity matrix...")

        products = await product_model.get_all_products_recommendation()

        if not products:
            logger.warn("No products found for building similarity matrix")
            return

        product_features = []
        product_ids = []

        for p in products:
            feature_text = ""

            for ingredient in p.get("ingredients", []):
                ingredient_name = ingredient.get("ingredient_name", "")
                if ingredient_name:
                    feature_text += f"{ingredient_name} " * 7

            category = p.get("category", {})
            feature_text += f"{category.get('main_category_name', '')} " * 3
            feature_text += f"{category.get('sub_category_name', '')} " * 2
            feature_text += f"{category.get('child_category_name', '')} " * 5

            uses = p.get("uses", "")
            uses = re.sub(r'<.*?>', ' ', uses)
            feature_text += f"{uses} " * 4

            dosage_form = p.get("dosage_form", "")
            feature_text += f"{dosage_form} " * 2

            brand = p.get("brand", "")
            origin = p.get("origin", "")
            feature_text += f"{brand} {origin} " * 2

            description = p.get("description", "")
            feature_text += f"{description} "

            product_features.append(feature_text)
            product_ids.append(p["product_id"])

        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(product_features)

        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

        _similarity_matrix = cosine_sim
        _product_indices = {pid: idx for idx, pid in enumerate(product_ids)}
        _product_data = {p["product_id"]: p for p in products}

        try:
            redis_client.set("similarity_matrix", pickle.dumps(_similarity_matrix))
            redis_client.set("product_indices", pickle.dumps(_product_indices))
            redis_client.set("product_data", pickle.dumps(_product_data))
        except Exception as e:
            logger.warn(f"Redis error when caching similarity matrix: {str(e)}")

        logger.info(f"Similarity matrix built successfully for {len(product_ids)} products")
    except Exception as e:
        logger.error(f"Error building similarity matrix: {str(e)}")


async def get_related_products(product_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    global _similarity_matrix, _product_indices, _product_data

    cache_key = f"related:{product_id}:{limit}"
    try:
        cached_result = redis_client.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for {cache_key}")
            return pickle.loads(cached_result)
    except Exception as e:
        logger.warn(f"Redis error when getting related products from cache: {str(e)}")

    try:
        if _similarity_matrix is None or _product_indices is None or _product_data is None:
            await build_similarity_matrix()

        if _similarity_matrix is None or _product_indices is None:
            logger.warn("Similarity matrix not available")
            product_info = await product_model.get_product_by_id_recommendation(product_id)
            if product_info and "category" in product_info:
                category = product_info["category"]
                related = await product_model.get_products_by_category_recommendation(
                    category.get("child_category_slug", "")
                )
                related = [p for p in related if p["product_id"] != product_id]

                for p in related[:limit]:
                    p["similarity_score"] = 0.5

                return related[:limit]
            return []

        if product_id not in _product_indices:
            logger.warn(f"Product ID {product_id} not found in indices")
            return []

        idx = _product_indices[product_id]

        sim_scores = list(enumerate(_similarity_matrix[idx]))

        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        sim_scores = sim_scores[1:limit + 1]

        result = []
        for i, (idx, score) in enumerate(sim_scores):
            for pid, index in _product_indices.items():
                if index == idx:
                    product_data = await product_model.get_product_by_id_recommendation(pid)

                    if product_data:
                        product_data["similarity_score"] = float(score)
                        processed_product = product_helper(product_data)
                        result.append(processed_product)
                    break

        try:
            if result:
                redis_client.setex(cache_key, CACHE_EXPIRY["related"], pickle.dumps(result))
        except Exception as e:
            logger.warn(f"Redis error when caching related products: {str(e)}")

        return result
    except Exception as e:
        logger.error(f"Error getting related products: {str(e)}")
        try:
            product_info = await product_model.get_product_by_id_recommendation(product_id)
            if product_info and "category" in product_info:
                category = product_info["category"]
                related = await product_model.get_products_by_category_recommendation(
                    category.get("child_category_slug", "")
                )
                related = [p for p in related if p["product_id"] != product_id]

                for p in related[:limit]:
                    p["similarity_score"] = 0.5

                return related[:limit]
        except Exception as inner_e:
            logger.error(f"Error in fallback for related products: {str(inner_e)}")

        return []

async def get_best_deals(user_id: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:

    cache_key = f"best_deals:{user_id or 'anonymous'}:{limit}"

    try:
        cached_result = redis_client.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for {cache_key}")
            return pickle.loads(cached_result)
    except Exception as e:
        logger.warn(f"Redis error when getting best deals from cache: {str(e)}")

    try:
        discounted_products = await product_model.get_products_with_discount_recommendation(min_discount=5)

        if not discounted_products:
            logger.warn("No discounted products found")
            return []

        ratings = await review_model.get_product_ratings_recommendation()

        sales_data = await order_model.get_product_purchase_counts_recommendation(days=30)

        user_preferences = {}

        if user_id:
            user_orders = await order_model.get_orders_by_user_recommendation(user_id)
            purchased_products = []
            for order in user_orders:
                for item in order.get("product", []):
                    purchased_products.append(item.get("product_id"))

            viewed_products = await user_model.get_user_viewed_products_recommendation(user_id)

            cart_products = await user_model.get_user_cart_products_recommendation(user_id)

            wishlist_products = await user_model.get_user_wishlist_products_recommendation(user_id)

            user_interests = set()
            for p_id in purchased_products:
                user_interests.add(p_id)
            for p_id in cart_products:
                user_interests.add(p_id)
            for p_id in wishlist_products:
                user_interests.add(p_id)
            for p_id in viewed_products:
                user_interests.add(p_id)

            category_interests = {}
            for p_id in user_interests:
                product = await product_model.get_product_by_id_recommendation(p_id)
                if product and "category" in product:
                    cat = product["category"]
                    for cat_level in ["main_category_slug", "sub_category_slug", "child_category_slug"]:
                        if cat_level in cat and cat[cat_level]:
                            category_interests[cat[cat_level]] = category_interests.get(cat[cat_level], 0) + 1

            for product in discounted_products:
                score = 0
                if "category" in product:
                    cat = product["category"]
                    if "main_category_slug" in cat and cat["main_category_slug"] in category_interests:
                        score += category_interests[cat["main_category_slug"]] * 0.3
                    if "sub_category_slug" in cat and cat["sub_category_slug"] in category_interests:
                        score += category_interests[cat["sub_category_slug"]] * 0.5
                    if "child_category_slug" in cat and cat["child_category_slug"] in category_interests:
                        score += category_interests[cat["child_category_slug"]] * 1.0

                if score > 0:
                    user_preferences[product["product_id"]] = score

        scored_products = []

        max_sales = max(sales_data.values()) if sales_data else 1

        for product in discounted_products:
            product_id = product["product_id"]

            if user_id and product_id in purchased_products:
                continue

            discount = 0
            if "prices" in product and len(product["prices"]) > 0:
                discount = product["prices"][0].get("discount", 0)

            rating_info = ratings.get(product_id, {})
            avg_rating = rating_info.get("avg_rating", 0) or 0
            rating_count = rating_info.get("rating_count", 0) or 0

            adjusted_rating = (avg_rating * min(rating_count, 10)) / 10
            normalized_sales = sales_data.get(product_id, 0) / max_sales if max_sales > 0 else 0

            total_score = (
                    (discount / 100) * 0.7 +
                    (adjusted_rating / 5) * 0.2 +
                    normalized_sales * 0.1
            )

            if user_id and product_id in user_preferences:
                total_score += user_preferences[product_id] * 0.4

            product_copy = dict(product)
            product_copy["deal_score"] = total_score
            product_copy["normalized_sales"] = normalized_sales

            scored_products.append(product_helper(product_copy))

        result = sorted(scored_products, key=lambda x: x["deal_score"], reverse=True)[:limit]

        try:
            redis_client.setex(cache_key, CACHE_EXPIRY["deals"], pickle.dumps(result))
        except Exception as e:
            logger.warn(f"Redis error when caching best deals: {str(e)}")

        return result
    except Exception as e:
        logger.error(f"Error getting best deals: {str(e)}")
        return []

async def get_featured_products(user_id: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
    cache_key = f"featured:{user_id or 'anonymous'}:{limit}"

    try:
        cached_result = redis_client.get(cache_key)
        if cached_result:
            logger.info(f"Cache hit for {cache_key}")
            return pickle.loads(cached_result)
    except Exception as e:
        logger.warn(f"Redis error when getting featured products from cache: {str(e)}")

    try:
        sales_data = await order_model.get_product_purchase_counts_recommendation(days=30)

        ratings = await review_model.get_product_ratings_recommendation()

        views = {}
        try:
            views_pipeline = [
                {"$group": {
                    "_id": "$product_id",
                    "view_count": {"$sum": 1}
                }}
            ]
            views_result = db.product_views.aggregate(views_pipeline).to_list(length=None)
            views = {doc["_id"]: doc["view_count"] for doc in views_result}
        except Exception:
            logger.warn("Product views collection not found, skipping views data")

        products = await product_model.get_all_products_recommendation()

        user_preferences = {}
        purchased_products = []

        if user_id:
            user_orders = await order_model.get_orders_by_user_recommendation(user_id)
            for order in user_orders:
                for item in order.get("product", []):
                    purchased_products.append(item.get("product_id"))

            viewed_products = await user_model.get_user_viewed_products_recommendation(user_id)

            cart_products = await user_model.get_user_cart_products_recommendation(user_id)

            wishlist_products = await user_model.get_user_wishlist_products_recommendation(user_id)

            user_interests = set()
            for p_id in purchased_products:
                user_interests.add(p_id)
            for p_id in cart_products:
                user_interests.add(p_id)
            for p_id in wishlist_products:
                user_interests.add(p_id)
            for p_id in viewed_products:
                user_interests.add(p_id)

            category_interests = {}
            for p_id in user_interests:
                product = await product_model.get_product_by_id_recommendation(p_id)
                if product and "category" in product:
                    cat = product["category"]
                    for cat_level in ["main_category_slug", "sub_category_slug", "child_category_slug"]:
                        if cat_level in cat and cat[cat_level]:
                            category_interests[cat[cat_level]] = category_interests.get(cat[cat_level], 0) + 1

            for product in products:
                score = 0
                if "category" in product:
                    cat = product["category"]
                    if "main_category_slug" in cat and cat["main_category_slug"] in category_interests:
                        score += category_interests[cat["main_category_slug"]] * 0.3
                    if "sub_category_slug" in cat and cat["sub_category_slug"] in category_interests:
                        score += category_interests[cat["sub_category_slug"]] * 0.5
                    if "child_category_slug" in cat and cat["child_category_slug"] in category_interests:
                        score += category_interests[cat["child_category_slug"]] * 1.0

                if score > 0:
                    user_preferences[product["product_id"]] = score

        now = datetime.now()
        scored_products = []

        max_sales = max(sales_data.values()) if sales_data else 1
        max_views = max(views.values()) if views else 1

        for product in products:
            product_id = product["product_id"]

            sales_count = sales_data.get(product_id, 0)
            normalized_sales = sales_count / max_sales if max_sales > 0 else 0

            rating_info = ratings.get(product_id, {})
            avg_rating = rating_info.get("avg_rating", 0) or 0
            rating_count = rating_info.get("rating_count", 0) or 0

            normalized_rating = (avg_rating / 5) * min(1, rating_count / 10)

            view_count = views.get(product_id, 0)
            normalized_views = view_count / max_views if max_views > 0 else 0

            created_at = product.get("created_at", now - timedelta(days=365))
            if isinstance(created_at, str):
                try:
                    created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                except:
                    created_at = now - timedelta(days=365)

            days_since_created = (now - created_at).days
            recency_score = max(0, 1 - (days_since_created / 30)) if days_since_created <= 30 else 0

            discount_score = 0
            if "prices" in product and len(product["prices"]) > 0:
                discount = product["prices"][0].get("discount", 0)
                discount_score = min(discount / 50, 1)

            inventory = product.get("inventory", 0)
            inventory_score = 0
            if inventory > 0:
                inventory_score = 1 - abs(0.5 - min(inventory / 2000, 1))

            weights = {
                "sales": 0.30,
                "rating": 0.20,
                "views": 0.10,
                "discount": 0.15,
                "recency": 0.15,
                "inventory": 0.10
            }

            total_score = (
                    normalized_sales * weights["sales"] +
                    normalized_rating * weights["rating"] +
                    normalized_views * weights["views"] +
                    discount_score * weights["discount"] +
                    recency_score * weights["recency"] +
                    inventory_score * weights["inventory"]
            )

            if user_id and product_id in user_preferences:
                total_score += user_preferences[product_id] * 0.3

            if user_id and product_id in purchased_products:
                total_score *= 0.7

            product_copy = dict(product)
            product_copy["featured_score"] = total_score
            product_copy["sales_count"] = sales_count
            product_copy["avg_rating"] = avg_rating
            product_copy["rating_count"] = rating_count
            product_copy["view_count"] = view_count

            scored_products.append(product_copy)

        result = sorted(scored_products, key=lambda x: x["featured_score"], reverse=True)[:limit]

        try:
            redis_client.setex(cache_key, CACHE_EXPIRY["featured"], pickle.dumps(result))
        except Exception as e:
            logger.warn(f"Redis error when caching featured products: {str(e)}")

        return result
    except Exception as e:
        logger.error(f"Error getting featured products: {str(e)}")
        return []

async def refresh_recommendations():
    try:
        keys = redis_client.keys("top_selling:*") + \
               redis_client.keys("related:*") + \
               redis_client.keys("best_deals:*") + \
               redis_client.keys("featured:*") + \
               ["similarity_matrix", "product_indices", "product_data"]

        if keys:
            redis_client.delete(*keys)

        logger.info(f"Cleared {len(keys)} recommendation cache entries")

        await build_similarity_matrix()

        await get_top_selling_products()
        await get_featured_products()
        await get_best_deals()

        return {"status": "success", "message": "Recommendations refreshed successfully"}
    except Exception as e:
        logger.error(f"Error refreshing recommendations: {str(e)}")
        return {"status": "error", "message": f"Error refreshing recommendations: {str(e)}"}