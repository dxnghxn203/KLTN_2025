from fastapi import APIRouter

from app.core import response
from app.models import location

router = APIRouter()


@router.post("/location/cities")
async def insert_cities():
    await location.insert_cities_into_elasticsearch()

@router.post("/location/districts")
async def insert_districts():
    await location.insert_districts_into_elasticsearch()

@router.post("/location/wards")
async def insert_wards():
    await location.insert_wards_into_elasticsearch()

@router.post("/location/regions")
async def insert_regions():
    await location.insert_regions_into_elasticsearch()

@router.delete("/location/cities")
async def delete_cities():
    await location.delete_cities()

@router.delete("/location/districts")
async def delete_districts():
    await location.delete_districts()

@router.delete("/location/wards")
async def delete_wards():
    await location.delete_wards()

@router.delete("/location/regions")
async def delete_regions():
    await location.delete_regions()

@router.get("/location/cities", response_model=response.BaseResponse)
async def get_all_cities():
    return await location.get_cities()

@router.get("/location/districts/{city_code}", response_model=response.BaseResponse)
async def get_districts_by_city(city_code: str):
    return await location.get_districts_by_city(city_code)

@router.get("/location/wards/{district_code}", response_model=response.BaseResponse)
async def get_wards_by_district(district_code: str):
    return await location.get_wards_by_district(district_code)

@router.get("/location/regions", response_model=response.BaseResponse)
async def get_all_regions():
    return await location.get_regions()