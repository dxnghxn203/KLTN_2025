import datetime

from bson import ObjectId
from starlette import status

from app.core import database, logger, response
from app.core.s3 import upload_file
from app.entities.review.request import ItemReviewReq, ItemReplyReq
from app.entities.review.response import ItemReviewRes
from app.models import user

collection_name = "reviews"


async def create_review(item: ItemReviewReq, token, images):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        item_dict = item.dict()
        item_dict["user_id"] = user_info.id
        item_dict["user_name"] = user_info.user_name
        image_urls = []
        if images:
            image_urls = [upload_file(img, "reviews") for img in images if img]

        item_dict["images"] = image_urls
        item_dict["created_at"] = datetime.datetime.now()
        item_dict["replies"] = []
        insert_result = collection.insert_one(item_dict)
        logger.info(f"[create_review] Đã thêm đánh giá mới, ID: {insert_result.inserted_id}")
        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            message="Tạo đánh giá thành công"
        )
    except Exception as e:
        raise e

async def get_review_by_product(product_id):
    collection = database.db[collection_name]
    reviews = list(collection.find({"product_id": product_id}))

    review_list = [ItemReviewRes.from_mongo(review) for review in reviews]
    return review_list

async def reply_to_review(item: ItemReplyReq, token, images):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        review_id = ObjectId(item.review_id)
        review = collection.find_one({"_id": ObjectId(review_id)})
        if not review:
            return response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy đánh giá"
            )
        image_urls = []
        if images:
            image_urls = [upload_file(img, "reviews") for img in images if img]

        reply = {
            "user_id": user_info.id,
            "user_name": user_info.user_name,
            "comment": item.comment,
            "created_at": datetime.datetime.now(),
            "images": image_urls
        }

        collection.update_one(
            {"_id": review_id},
            {"$push": {"replies": reply}}
        )

        logger.info(f"[reply_to_review] Thêm phản hồi thành công vào review_id: {item.review_id}")
        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Thêm phản hồi thành công"
        )
    except Exception as e:
        raise e