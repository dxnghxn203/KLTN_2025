from app.core.database import db
from app.core.s3 import upload_file
from app.entities.category.request import MainCategoryInReq, MainCategoryReq, ChildCategoryReq, SubCategoryReq, \
    SubCategoryInReq, ChildCategoryInReq
from app.helpers.constant import generate_id
from app.middleware.logging import logger

COLLECTION_NAME = "categories"
PRODUCT_COLLECTION = "products"

async def get_all_categories():
    try:
        collection = db[COLLECTION_NAME]
        return list(collection.find({}, {"_id": 0, "main_category_id": 1, "main_category_name": 1, "main_category_slug": 1}))
    except Exception as e:
        logger.error(f"Error getting all categories: {str(e)}")
        raise e

async def get_category_by_slug(main_slug: str):
    try:
        collection = db[COLLECTION_NAME]
        category = collection.find_one({"main_category_slug": main_slug}, {"_id": 0})
        if not category:
            return None

        product_collection = db[PRODUCT_COLLECTION]
        products = list(product_collection.find({"category.main_category_slug": main_slug}, {"_id": 0}))
        category["products"] = products

        return category
    except Exception as e:
        logger.error(f"Error getting category by slug: {str(e)}")
        raise e

async def get_sub_category(main_slug: str, sub_slug: str):
    try:
        collection = db[COLLECTION_NAME]
        category = collection.find_one({"main_category_slug": main_slug}, {"_id": 0, "sub_category": 1})
        if not category:
            raise ValueError("Main category not found")

        sub_category = next((sub for sub in category.get("sub_category", []) if sub["sub_category_slug"] == sub_slug),
                            None)
        if not sub_category:
            raise ValueError("Sub-category not found")

        product_collection = db[PRODUCT_COLLECTION]
        sub_category["products"] = list(product_collection.find({"category.sub_category_slug": sub_slug}, {"_id": 0}))

        return sub_category
    except Exception as e:
        logger.error(f"Error getting sub-category: {str(e)}")
        raise e

async def get_child_category(main_slug: str, sub_slug: str, child_slug: str):
    try:
        collection = db[COLLECTION_NAME]
        category = collection.find_one({"main_category_slug": main_slug}, {"_id": 0, "sub_category": 1})
        if not category:
            raise ValueError("Main category not found")

        for sub in category.get("sub_category", []):
            if sub["sub_category_slug"] == sub_slug:
                child_category = next(
                    (child for child in sub.get("child_category", []) if child["child_category_slug"] == child_slug),
                    None)
                if not child_category:
                    raise ValueError("Child-category not found")

                product_collection = db[PRODUCT_COLLECTION]
                child_category["products"] = list(
                    product_collection.find({"category.child_category_slug": child_slug}, {"_id": 0}))

                return child_category

        raise ValueError("Sub-category not found")
    except Exception as e:
        logger.error(f"Error getting child-category: {str(e)}")
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
                ))

            sub_categories.append(SubCategoryReq(
                sub_category_id=sub_category_id,
                sub_category_name=sub.sub_category_name,
                sub_category_slug=sub.sub_category_slug,
                child_category=child_categories
            ))

        category_data = MainCategoryReq(
            main_category_id=main_category_id,
            main_category_name=item.main_category_name,
            main_category_slug=item.main_category_slug,
            sub_category=sub_categories
        )

        collection.insert_one(category_data.dict())
    except Exception as e:
        logger.error(f"Error adding category: {str(e)}")
        raise e


async def add_sub_category(main_slug: str, sub_category: SubCategoryInReq):
    try:
        collection = db[COLLECTION_NAME]
        category = collection.find_one({"main_category_slug": main_slug})

        if not category:
            raise ValueError("Main category not found")

        existing_sub = next(
            (sub for sub in category.get("sub_category", []) if
             sub["sub_category_slug"] == sub_category.sub_category_slug),
            None
        )
        if existing_sub:
            raise ValueError("Sub category slug already exists")

        sub_category_id = generate_id("SUB")
        child_categories = [ChildCategoryReq(
            child_category_id=generate_id("CHILD"),
            child_category_name=child.child_category_name,
            child_category_slug=child.child_category_slug
        ) for child in sub_category.child_category]

        new_sub_category = SubCategoryReq(
            sub_category_id=sub_category_id,
            sub_category_name=sub_category.sub_category_name,
            sub_category_slug=sub_category.sub_category_slug,
            child_category=child_categories
        )

        collection.update_one(
            {"main_category_slug": main_slug},
            {"$push": {"sub_category": new_sub_category.dict()}}
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
                existing_child = next(
                    (child for child in sub.get("child_category", []) if
                     child["child_category_slug"] == child_category.child_category_slug),
                    None
                )
                if existing_child:
                    raise ValueError("Child category slug already exists")

                child_category_id = generate_id("CHILD")
                new_child_category = ChildCategoryReq(
                    child_category_id=child_category_id,
                    child_category_name=child_category.child_category_name,
                    child_category_slug=child_category.child_category_slug
                )

                collection.update_one(
                    {"main_category_slug": main_slug, "sub_category.sub_category_slug": sub_slug},
                    {"$push": {"sub_category.$.child_category": new_child_category.dict()}}
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

async def update_sub_category_image(sub_category_id: str, image: str):
    try:
        image_url = upload_file(image, "sub_category")

        collection = db[COLLECTION_NAME]
        result = collection.update_one(
            {"sub_category.sub_category_id": sub_category_id},
            {"$set": {"sub_category.$.sub_image_url": image_url}}
        )
        if result.modified_count == 0:
            raise ValueError("Không có danh mục con nào được cập nhật")
    except Exception as e:
        logger.error(f"Lỗi cập nhật ảnh danh mục con: {str(e)}")
        raise e

async def update_child_category_image(child_category_id: str, image: str):
    try:
        image_url = upload_file(image, "child_category")

        collection = db[COLLECTION_NAME]
        result = collection.update_one(
            {"sub_category.child_category.child_category_id": child_category_id},
            {"$set": {"sub_category.$[].child_category.$[child].child_image_url": image_url}},
            array_filters=[{"child.child_category_id": child_category_id}]
        )
        if result.modified_count == 0:
            raise ValueError("Không có danh mục con cấp 2 nào được cập nhật")
    except Exception as e:
        logger.error(f"Lỗi cập nhật ảnh danh mục con cấp 2: {str(e)}")
        raise e

# async def update_all_categories_image(image_url):
#     try:
#         #image_url = upload_file(image, "default")
#
#         collection = db[COLLECTION_NAME]
#
#         categories = collection.find({})
#         categories = categories.to_list(length=None)
#
#         updated_count = 0
#
#         for category in categories:
#             updated = False  # Biến flag để kiểm tra có cần update không
#
#             # Kiểm tra sub_category
#             if "sub_category" in category:
#                 for sub in category["sub_category"]:
#                     if "sub_image_url" not in sub or sub["sub_image_url"] == "":
#                         sub["sub_image_url"] = image_url
#                         updated = True
#
#                     # Kiểm tra child_category trong sub_category
#                     if "child_category" in sub:
#                         for child in sub["child_category"]:
#                             if "child_image_url" not in child or child["child_image_url"] == "":
#                                 child["child_image_url"] = image_url
#                                 updated = True
#
#             # Nếu có thay đổi thì cập nhật lại MongoDB
#             if updated:
#                 collection.update_one(
#                     {"_id": category["_id"]}, {"$set": {"sub_category": category["sub_category"]}}
#                 )
#                 updated_count += 1
#
#         if updated_count == 0:
#             raise ValueError("Không có danh mục nào cần cập nhật")
#
#         logger.info(f"Updated {updated_count} categories with default image.")
#     except Exception as e:
#         logger.error(f"Lỗi cập nhật ảnh mặc định: {str(e)}")
#         raise e
