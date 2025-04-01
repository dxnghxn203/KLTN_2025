from typing import Optional, List

from fastapi import APIRouter, status, UploadFile, File, Depends
from pyfa_converter_v2 import BodyDepends

from app.core import logger, response
from app.core.response import JsonException
from app.entities.product.request import ItemProductDBInReq, UpdateCategoryReq
from app.helpers.redis import get_session, get_recently_viewed, save_recently_viewed, save_session
from app.middleware import middleware
from app.models import order, auth
from app.models.product import get_product_by_slug, add_product_db, get_all_product, update_product_category, \
    delete_product, get_product_top_selling, get_product_featured, get_product_by_list_id
from app.models.user import get_current

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

@router.get("/product/session/{slug}", response_model=response.BaseResponse)
async def get_product(slug: str, session_id: str = None):
    try:
        check = get_session(session_id)
        product = await get_product_by_slug(slug)
        if not product:
            return response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )
        logger.info(f"check: {check}")
        cur_session = session_id if check else save_session()
        save_recently_viewed(cur_session, product.product_id, False)

        return response.BaseResponse(status="success",data={
            "product": product,
            "session_id": cur_session
        })

    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting product", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/product/{slug}/", response_model=response.BaseResponse)
async def get_product(slug: str, token: str = Depends(middleware.verify_token)):
    try:
        us = await auth.get_current(token)
        if not us:
            return response.BaseResponse(
                status="error",
                message="User not found",
                data=None
            )

        product = await get_product_by_slug(slug)

        if not product:
            return response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Product not found"
            )
        save_recently_viewed(us["username"],product.product_id, True)

        return response.BaseResponse(status="success",data={
                "product": product,
                "session_id": None
        })
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

@router.get("/products/get-recently-viewed/{session}", response_model=response.BaseResponse)
async def get_recently_viewed_session(session: str):
    try:
        check = get_session(session)
        if not check:
            return response.BaseResponse(
                status="error",
                message="Session not found",
                data=None
            )
        data = get_recently_viewed(session)
        products = await get_product_by_list_id(data)
        return response.BaseResponse(
            message="Recently viewed products found",
            data=products
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting recently viewed products", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/products/get-recently-viewed", response_model=response.BaseResponse)
async def get_recently_viewed_token(token: str = Depends(middleware.verify_token)):
    try:
        us = await get_current(token)
        if not us:
            return response.BaseResponse(
                status="error",
                message="User not found",
                data=None
            )
        data = get_recently_viewed(us["username"])
        products = await get_product_by_list_id(data)
        return response.BaseResponse(
            message="Recently viewed products found",
            data=products
        )
    except JsonException as je:
        raise je
    except Exception as e:
        logger.error("Error getting recently viewed products", error=str(e))
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )