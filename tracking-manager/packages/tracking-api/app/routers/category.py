from fastapi import APIRouter, status
from app.core import logger, response
from app.entities.category.request import MainCategoryReq, SubCategoryReq, ChildCategoryReq
from app.models import category

router = APIRouter()

@router.get("/category/", response_model=response.BaseResponse)
async def get_categories():
    try:
        data = await category.get_all_categories()
        return response.BaseResponse(data=data)
    except Exception as e:
        logger.error(f"Error getting all categories: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/category/{main_slug}", response_model=response.BaseResponse)
async def get_category(main_slug: str):
    try:
        data = await category.get_category_by_slug(main_slug)
        if not data:
            raise response.JsonException(
                status_code=status.HTTP_404_NOT_FOUND,
                message="Category not found"
            )
        return response.BaseResponse(data=data)
    except Exception as e:
        logger.error(f"Error getting category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/category/add", response_model=response.BaseResponse)
async def create_category(new_category: MainCategoryReq):
    try:
        await category.add_category(new_category.dict())
        return response.BaseResponse(message="Main-category added successfully")
    except ValueError as e:
        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )
    except Exception as e:
        logger.error(f"Error adding category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.put("/category/update/{main_slug}", response_model=response.BaseResponse)
async def update_category(main_slug: str, updated_category: MainCategoryReq):
    try:
        data = await category.update_category(main_slug, updated_category.dict())
        return response.BaseResponse(data=data)
    except ValueError as e:
        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )
    except Exception as e:
        logger.error(f"Error updating category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

# @router.delete("/category/delete/{main_slug}", response_model=response.BaseResponse)
# async def delete_category(main_slug: str):
#     try:
#         data = await category.delete_category(main_slug)
#         return response.BaseResponse(data=data)
#     except ValueError as e:
#         raise response.JsonException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             message=str(e)
#         )
#     except Exception as e:
#         logger.error(f"Error deleting category: {str(e)}")
#         raise response.JsonException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             message="Internal server error"
#         )

@router.post("/category/{main_slug}/sub-category/add", response_model=response.BaseResponse)
async def create_sub_category(main_slug: str, sub_category: SubCategoryReq):
    try:
        await category.add_sub_category(main_slug, sub_category.dict())
        return response.BaseResponse(message="Sub-category added successfully")
    except ValueError as e:
        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )
    except Exception as e:
        logger.error(f"Error adding sub-category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/category/{main_slug}/sub-category/{sub_slug}/child-category/add", response_model=response.BaseResponse)
async def create_child_category(main_slug: str, sub_slug: str, child_category: ChildCategoryReq):
    try:
        await category.add_child_category(main_slug, sub_slug, child_category.dict())
        return response.BaseResponse(message="Child-category added successfully")
    except ValueError as e:
        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=str(e)
        )
    except Exception as e:
        logger.error(f"Error adding child category: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
