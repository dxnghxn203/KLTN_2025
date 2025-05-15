from datetime import datetime

from starlette import status
from app.core import database, logger, response
from app.entities.voucher.request import ItemVoucherDBInReq, ItemVoucherDBReq
from app.entities.voucher.response import ItemVoucherDBRes
from app.helpers.constant import generate_id

collection_name = "vouchers"

async def get_all_vouchers(page: int, page_size: int):
    collection = database.db[collection_name]
    skip_count = (page - 1) * page_size
    voucher_list = collection.find().skip(skip_count).limit(page_size)
    return [ItemVoucherDBRes(**voucher) for voucher in voucher_list]

async def get_voucher_by_id(voucher_id: str):
    collection = database.db[collection_name]
    voucher = collection.find_one({"voucher_id": voucher_id})
    return ItemVoucherDBRes(**voucher)

async def create_voucher(item: ItemVoucherDBInReq, email: str):
    try:
        item_data = ItemVoucherDBReq(
            **item.dict(),
            voucher_id=generate_id("VOUCHER"),
            created_by=email,
            updated_by=email,
        )
        collection = database.db[collection_name]
        insert_result = collection.insert_one(item_data.dict())
        logger.info(f"[create_voucher] Đã thêm voucher mới, ID: {insert_result.inserted_id}")
    except Exception as e:
        logger.error(f"Error creating voucher: {str(e)}")
        raise e

async def update_status(voucher_id: str, status: bool, email):
    try:
        collection = database.db[collection_name]
        collection.update_one(
            {"voucher_id": voucher_id},
            {
                "$set": {
                    "active": status,
                    "updated_at": datetime.utcnow(),
                    "updated_by": email
                }
            }
        )
        return response.SuccessResponse(message=f"Cập nhật trạng thái voucher thành {status}")
    except Exception as e:
        logger.error(f"Error updating voucher status: {str(e)}")
        raise e

async def delete_voucher(voucher_id: str):
    try:
        collection = database.db[collection_name]
        collection.delete_one({"voucher_id": voucher_id})
        return response.SuccessResponse(message="Xóa voucher thành công")
    except Exception as e:
        logger.error(f"Error deleting voucher: {str(e)}")
        raise e