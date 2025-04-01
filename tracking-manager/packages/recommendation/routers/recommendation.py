from fastapi import Depends, APIRouter

from core import logger
from core.response import BaseResponse
from services.recommendation import RecommendationSystem

router = APIRouter()

recommender = RecommendationSystem()

def get_recommender():
    return recommender

@router.get("/top-selling/", response_model=BaseResponse)
def top_selling(top_n: int = 5, recommender: RecommendationSystem = Depends(get_recommender)):
    try:
        return BaseResponse(
            status_code=200,
            status="success",
            message="Top selling products",
            data=recommender.get_top_selling_products(top_n).to_dict(orient="records")
        )
    except Exception as e:
        logger.info(e)
        return BaseResponse(
            status_code=500,
            status="error",
            message="Internal server error",
            data=None
        )

@router.get("/recently-viewed/", response_model=BaseResponse)
def recently_viewed(user_id: str, recommender: RecommendationSystem = Depends(get_recommender)):
    try:
        return BaseResponse(
            status_code=200,
            status="success",
            message="Recently viewed products",
            data=recommender.get_recently_viewed(user_id).to_dict(orient="records")
        )
    except Exception as e:
        logger.info(e)
        return BaseResponse(
            status_code=500,
            status="error",
            message="Internal server error",
            data=None
        )

@router.get("/featured/", response_model=BaseResponse)
def featured_products(main_category_id: str, sub_category_id: str =None, child_category_id: str=None,  top_n: int = 5, recommender: RecommendationSystem = Depends(get_recommender)):
    try:
        return BaseResponse(
            status_code=200,
            status="success",
            message="featured_products",
            data=recommender.get_featured_products(main_category_id,sub_category_id, child_category_id,  top_n).to_dict(orient="records")
        )
    except Exception as e:
        logger.info(e)
        return BaseResponse(
            status_code=500,
            status="error",
            message="Internal server error",
            data=None
        )
@router.get("/related/", response_model=BaseResponse)
def related_products(product_id: str, top_n: int = 5, recommender: RecommendationSystem = Depends(get_recommender)):
    try:
        return BaseResponse(
            status_code=200,
            status="success",
            message="related_products",
            data= recommender.get_related_products(product_id, top_n).to_dict(orient="records")
        )
    except Exception as e:
        logger.info(e)
        return BaseResponse(
            status_code=500,
            status="error",
            message="Internal server error",
            data=None
        )
@router.get("/collaborative/", response_model=BaseResponse)
def collaborative_recommendations(user_id: str, top_n: int = 5, recommender: RecommendationSystem = Depends(get_recommender)):
    try:
        return BaseResponse(
            status_code=200,
            status="success",
            message="collaborative_recommendations",
            data=recommender.get_collaborative_recommendations(user_id, top_n).to_dict(orient="records")
        )
    except Exception as e:
        logger.info(e)
        return BaseResponse(
            status_code=500,
            status="error",
            message="Internal server error",
            data=None
        )