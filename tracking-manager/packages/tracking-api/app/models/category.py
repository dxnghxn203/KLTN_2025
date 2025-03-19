from app.core.database import db
from app.middleware.logging import logger

COLLECTION_NAME = "categories"
PRODUCT_COLLECTION = "products"

async def get_all_categories():
    try:
        collection = db[COLLECTION_NAME]
        return list(collection.find({}, {"_id": 0}))  # Ẩn ObjectId
    except Exception as e:
        logger.error(f"Error getting all categories: {str(e)}")
        raise e


async def get_category_by_slug(main_slug: str):
    try:
        collection = db[COLLECTION_NAME]
        return collection.find_one({"main_category_slug": main_slug}, {"_id": 0})
    except Exception as e:
        logger.error(f"Error getting category by slug: {str(e)}")
        raise e


async def add_category(item: dict):
    try:
        collection = db[COLLECTION_NAME]
        existing = collection.find_one({"main_category_slug": item["main_category_slug"]})
        if existing:
            raise ValueError("Main category already exists")

        await collection.insert_one(item)
    except Exception as e:
        logger.error(f"Error adding category: {str(e)}")
        raise e


async def update_category(main_slug: str, updated_data: dict):
    try:
        collection = db[COLLECTION_NAME]
        result = collection.update_one(
            {"main_category_slug": main_slug},
            {"$set": updated_data}
        )
        if result.modified_count == 0:
            raise ValueError("No category updated")
    except Exception as e:
        logger.error(f"Error updating category: {str(e)}")
        raise e


# async def delete_category(main_slug: str):
#     try:
#         collection = db[COLLECTION_NAME]
#         result = collection.delete_one({"main_category_slug": main_slug})
#         if result.deleted_count == 0:
#             raise ValueError("Category not found")
#         return {"message": "Category deleted successfully"}
#     except Exception as e:
#         logger.error(f"Error deleting category: {str(e)}")
#         raise e

async def add_sub_category(main_slug: str, sub_category: dict):
    try:
        collection = db[COLLECTION_NAME]
        category = collection.find_one({"main_category_slug": main_slug})

        if not category:
            raise ValueError("Main category not found")

        for sub in category.get("sub_category", []):
            if sub["sub_category_slug"] == sub_category["sub_category_slug"]:
                raise ValueError("Sub-category already exists")

        category["sub_category"].append(sub_category)
        collection.update_one({"main_category_slug": main_slug}, {"$set": {"sub_category": category["sub_category"]}})
    except Exception as e:
        logger.error(f"Error adding sub-category: {str(e)}")
        raise e


async def add_child_category(main_slug: str, sub_slug: str, child_category: dict):
    try:
        collection = db[COLLECTION_NAME]
        category = collection.find_one({"main_category_slug": main_slug})

        if not category:
            raise ValueError("Main category not found")

        found = False

        for sub in category.get("sub_category", []):
            if sub["sub_category_slug"] == sub_slug:
                found = True

                for child in sub.get("child_category", []):
                    if child["child_category_slug"] == child_category["child_category_slug"]:
                        raise ValueError("Child category already exists")

                sub["child_category"].append(child_category)
                collection.update_one({"main_category_slug": main_slug},
                                      {"$set": {"sub_category": category["sub_category"]}})
                break

        if not found:
            raise ValueError("Sub-category not found")
    except Exception as e:
        logger.error(f"Error adding child category: {str(e)}")
        raise e
