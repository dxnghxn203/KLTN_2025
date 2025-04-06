from fastapi import APIRouter, status

from app.core import response
from app.helpers.constant import FEE_INDEX
from app.models import fee
from app.core import logger
router = APIRouter()

@router.post("/fee")
async def insert_fee():
    try:
        await fee.insert_fee_into_elasticsearch('pricing.json', FEE_INDEX)
    except Exception as e:
        logger.error(f"Error inserting fee: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/fee")
async def delete_fee():
    try:
        await fee.delete_fee(FEE_INDEX)
    except Exception as e:
        logger.error(f"Error deleting fee: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/fee", response_model=response.SuccessResponse)
async def get_all_fee():
    try:
        return await fee.get_fee(FEE_INDEX)
    except Exception as e:
        logger.error("Error getting current", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )