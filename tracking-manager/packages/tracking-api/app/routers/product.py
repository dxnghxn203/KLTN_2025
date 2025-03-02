from fastapi import APIRouter, status

from app.core import logger, response
from app.models.product import get_product_by_slug

router = APIRouter()

@router.get("/product/{slug}")
async def get_product(slug: str):
    try:
        product = await get_product_by_slug(slug)
        if not product:
            return response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )
        return response.BaseResponse(status="success",data={**product, "_id": str(product["_id"])})
    except Exception as e:
        logger.error("Error getting product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )