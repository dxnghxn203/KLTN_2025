from fastapi import APIRouter
from starlette import status

from app.core import response, logger
from app.models import location

router = APIRouter()

@router.post("/location/cities")
async def insert_cities():
    try:
        await location.insert_cities_into_elasticsearch()
    except Exception as e:
        logger.error(f"Error inserting cities: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/location/districts")
async def insert_districts():
    try:
        await location.insert_districts_into_elasticsearch()
    except Exception as e:
        logger.error(f"Error inserting districts: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )
@router.post("/location/wards")
async def insert_wards():
    try:
        await location.insert_wards_into_elasticsearch()
    except Exception as e:
        logger.error(f"Error inserting wards: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.post("/location/regions")
async def insert_regions():
    try:
        await location.insert_regions_into_elasticsearch()
    except Exception as e:
        logger.error(f"Error inserting regions: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/location/cities")
async def delete_cities():
    try:
        await location.delete_cities()
    except Exception as e:
        logger.error(f"Error deleting cities: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/location/districts")
async def delete_districts():
    try:
        await location.delete_districts()
    except Exception as e:
        logger.error(f"Error deleting districts: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/location/wards")
async def delete_wards():
    try:
        await location.delete_wards()
    except Exception as e:
        logger.error(f"Error deleting wards: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.delete("/location/regions")
async def delete_regions():
    try:
        await location.delete_regions()
    except Exception as e:
        logger.error(f"Error deleting regions: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/location/cities", response_model=response.BaseResponse)
async def get_all_cities():
    try:
        return response.SuccessResponse(data=await location.get_cities())
    except Exception as e:
        logger.error(f"Error getting all cities: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/location/districts/{city_code}", response_model=response.BaseResponse)
async def get_districts_by_city(city_code: str):
    try:
        return response.SuccessResponse(data=await location.get_districts_by_city(city_code))
    except Exception as e:
        logger.error(f"Error getting districts by city: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/location/wards/{district_code}", response_model=response.BaseResponse)
async def get_wards_by_district(district_code: str):
    try:
        return response.SuccessResponse(data=await location.get_wards_by_district(district_code))
    except Exception as e:
        logger.error(f"Error getting wards by district: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )

@router.get("/location/regions", response_model=response.BaseResponse)
async def get_all_regions():
    try:
        return response.SuccessResponse(data=await location.get_regions())
    except Exception as e:
        logger.error(f"Error getting all regions: {str(e)}")
        raise response.JsonException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message="Internal server error"
        )