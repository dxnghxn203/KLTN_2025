from typing import Optional, List

from fastapi import APIRouter, status, UploadFile, File
from pyfa_converter_v2 import BodyDepends

from app.core import logger, response
from app.entities.product.request import ItemProductDBInReq
from app.models.product import get_product_by_slug, add_product_db
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

@router.post("/product/add", response_model=response.BaseResponse)
async def add_product(item: ItemProductDBInReq = BodyDepends(ItemProductDBInReq),
                      images_primary: Optional[UploadFile] = File(None),
                    images: Optional[List[UploadFile]] = File(None)):
    try:
        logger.info(f"item router: {item}")
        await add_product_db(item, images_primary, images)
        return response.BaseResponse(status="success", message="Product added successfully")
    except Exception as e:
        logger.error("Error adding product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
