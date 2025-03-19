from datetime import datetime

from app.core.database import db
from app.entities.category.request import MainCategoryInReq, MainCategoryReq, ChildCategoryReq, SubCategoryReq, \
    SubCategoryInReq, ChildCategoryInReq
from app.helpers.constant import generate_random_string, generate_id
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


async def add_category(item: MainCategoryInReq):
    try:
        collection = db[COLLECTION_NAME]
        existing = collection.find_one({"main_category_slug": item.main_category_slug})
        if existing:
            raise ValueError("Main category already exists")

        main_category_id = generate_id("MAIN")
        sub_categories = []

        for sub in item.sub_category:
            sub_category_id = generate_id("SUB")
            child_categories = []

            for child in sub.child_category:
                child_category_id = generate_id("CHILD")
                child_categories.append(ChildCategoryReq(
                    child_category_id=child_category_id,
                    child_category_name=child.child_category_name,
                    child_category_slug=child.child_category_slug
                ).dict())

            sub_categories.append(SubCategoryReq(
                sub_category_id=sub_category_id,
                sub_category_name=sub.sub_category_name,
                sub_category_slug=sub.sub_category_slug,
                child_category=child_categories
            ).dict())

        category_data = MainCategoryReq(
            main_category_id=main_category_id,
            main_category_name=item.main_category_name,
            main_category_slug=item.main_category_slug,
            sub_category=sub_categories
        )

        await collection.insert_one(category_data.dict())
    except Exception as e:
        logger.error(f"Error adding category: {str(e)}")
        raise e


async def add_sub_category(main_slug: str, sub_category: SubCategoryInReq):
    try:
        collection = db[COLLECTION_NAME]
        category = collection.find_one({"main_category_slug": main_slug})

        if not category:
            raise ValueError("Main category not found")

        sub_category_id = generate_id("SUB")
        child_categories = [ChildCategoryReq(
            child_category_id=generate_id("CHILD"),
            child_category_name=child.child_category_name,
            child_category_slug=child.child_category_slug
        ).dict() for child in sub_category.child_category]

        new_sub_category = SubCategoryReq(
            sub_category_id=sub_category_id,
            sub_category_name=sub_category.sub_category_name,
            sub_category_slug=sub_category.sub_category_slug,
            child_category=child_categories
        ).dict()

        collection.update_one(
            {"main_category_slug": main_slug},
            {"$push": {"sub_category": new_sub_category}}
        )
    except Exception as e:
        logger.error(f"Error adding sub-category: {str(e)}")
        raise e


async def add_child_category(main_slug: str, sub_slug: str, child_category: ChildCategoryInReq):
    try:
        collection = db[COLLECTION_NAME]
        category = collection.find_one({"main_category_slug": main_slug})

        if not category:
            raise ValueError("Main category not found")

        for sub in category.get("sub_category", []):
            if sub["sub_category_slug"] == sub_slug:
                child_category_id = generate_id("CHILD")
                new_child_category = ChildCategoryReq(
                    child_category_id=child_category_id,
                    child_category_name=child_category.child_category_name,
                    child_category_slug=child_category.child_category_slug
                ).dict()

                collection.update_one(
                    {"main_category_slug": main_slug, "sub_category.sub_category_slug": sub_slug},
                    {"$push": {"sub_category.$.child_category": new_child_category}}
                )
                return

        raise ValueError("Sub-category not found")
    except Exception as e:
        logger.error(f"Error adding child category: {str(e)}")
        raise e

async def update_main_category(main_category_id: str, main_category_name: str, main_category_slug: str):
    try:
        collection = db[COLLECTION_NAME]
        update_data = {}

        if main_category_name:
            update_data["main_category_name"] = main_category_name
        if main_category_slug:
            update_data["main_category_slug"] = main_category_slug

        if not update_data:
            raise ValueError("Không có dữ liệu để cập nhật")

        result = collection.update_one(
            {"main_category_id": main_category_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            raise ValueError("Không có danh mục nào được cập nhật")

        if "main_category_slug" in update_data:
            product_collection = db[PRODUCT_COLLECTION]
            product_collection.update_many(
                {"main_category_id": main_category_id},
                {"$set": {"main_category_slug": update_data["main_category_slug"]}}
            )
    except Exception as e:
        logger.error(f"Lỗi cập nhật danh mục chính: {str(e)}")
        raise e

async def update_sub_category(sub_category_id: str, sub_category_name: str, sub_category_slug: str):
    try:
        collection = db[COLLECTION_NAME]

        update_data = {}
        if sub_category_name:
            update_data["sub_category.$.sub_category_name"] = sub_category_name
        if sub_category_slug:
            update_data["sub_category.$.sub_category_slug"] = sub_category_slug

        if not update_data:
            raise ValueError("Không có dữ liệu để cập nhật")

        result = collection.update_one(
            {"sub_category.sub_category_id": sub_category_id},
            {"$set": update_data}
        )

        if result.modified_count == 0:
            raise ValueError("Không có danh mục con nào được cập nhật")

        if "sub_category.$.sub_category_slug" in update_data:
            product_collection = db[PRODUCT_COLLECTION]
            product_collection.update_many(
                {"sub_category_id": sub_category_id},
                {"$set": {"sub_category_slug": update_data["sub_category.$.sub_category_slug"]}}
            )
    except Exception as e:
        logger.error(f"Lỗi cập nhật danh mục con: {str(e)}")
        raise e

async def update_child_category(child_category_id: str, child_category_name: str, child_category_slug: str):
    try:
        collection = db[COLLECTION_NAME]

        update_data = {}
        if child_category_name:
            update_data["sub_category.$[].child_category.$[child].child_category_name"] = child_category_name
        if child_category_slug:
            update_data["sub_category.$[].child_category.$[child].child_category_slug"] = child_category_slug

        if not update_data:
            raise ValueError("Không có dữ liệu để cập nhật")

        result = collection.update_one(
            {"sub_category.child_category.child_category_id": child_category_id},
            {"$set": update_data},
            array_filters=[{"child.child_category_id": child_category_id}]
        )

        if result.modified_count == 0:
            raise ValueError("Không có danh mục con cấp 2 nào được cập nhật")

        if "sub_category.$[].child_category.$[child].child_category_slug" in update_data:
            product_collection = db[PRODUCT_COLLECTION]
            product_collection.update_many(
                {"child_category_id": child_category_id},
                {"$set": {"child_category_slug": update_data["sub_category.$[].child_category.$[child].child_category_slug"]}}
            )
    except Exception as e:
        logger.error(f"Lỗi cập nhật danh mục con cấp 2: {str(e)}")
        raise e
