from typing import Optional, List

from fastapi import APIRouter, status, UploadFile, File
from pyfa_converter_v2 import BodyDepends

from app.core import logger, response
from app.core.response import JsonException
from app.entities.product.request import ItemProductDBInReq, UpdateCategoryReq
from app.models import order
from app.models.product import get_product_by_slug, add_product_db, get_all_product, update_product_category, \
    delete_product, get_product_top_selling, get_product_featured

router = APIRouter()

@router.get("/products/top-selling", response_model=response.BaseResponse)
async def get_top_selling(top_n: int = 5):
    try:
        return await get_product_top_selling(top_n)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting top selling product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/featured", response_model=response.BaseResponse)
async def get_featured(main_category_id: str, sub_category_id: Optional[str] = None, child_category_id: Optional[str] = None, top_n: int = 5):
    try:
        return await get_product_featured(main_category_id, sub_category_id, child_category_id, top_n)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting featured product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

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
    except JsonException as je:
        raise je
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
        return response.SuccessResponse(status="success", message="Product added successfully")
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/all-product-admin", response_model=response.BaseResponse)
async def get_all_product_admin(page: int = 1, page_size: int = 10):
    try:
        result = await get_all_product(page, page_size)
        return response.BaseResponse(
            message=f"product found",
            data=result
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/product/update_name", response_model=response.BaseResponse)
async def update_product_category_name(item: UpdateCategoryReq):
    try:
        return await update_product_category(item)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error adding product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/popular", response_model=response.BaseResponse)
async def get_popular(top_n: int = 5):
    try:
        data = await order.get_popular_products(top_n)
        return response.BaseResponse(
            message="Popular products found",
            data=data
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting popular product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/product/update_name", response_model=response.BaseResponse)
async def delete_product(product_id: str):
    try:
        return await delete_product(product_id)
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error deleting product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )