import datetime
import os

import pandas as pd
from starlette import status

from app.core import elasticsearch, database, logger, response
from app.entities.location.request import ItemLocationReq
from app.entities.location.response import City, District, Ward, Region, ItemLocationUser
from app.helpers.constant import CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX, generate_id
from app.helpers.es_location import insert_es_cities, delete_index, insert_es_districts, insert_es_wards, \
    insert_es_regions
from app.models import user

collection_name = "locations"

INDEX_MAPPING = {
    CITY_INDEX: insert_es_cities,
    DISTRICT_INDEX: insert_es_districts,
    WARD_INDEX: insert_es_wards,
    REGION_INDEX: insert_es_regions,
}

MODEL_MAPPING = {
    CITY_INDEX: City,
    DISTRICT_INDEX: District,
    WARD_INDEX: Ward,
    REGION_INDEX: Region,
}

def read_excel_file(filename):
    excel_path = os.path.join('app/static', filename)
    return pd.read_excel(excel_path, engine='openpyxl')

async def insert_into_elasticsearch(index_name, filename):
    if index_name in INDEX_MAPPING:
        df = read_excel_file(filename)
        await INDEX_MAPPING[index_name](df)

async def delete_index_by_name(index_name):
    delete_index(index_name)

async def query_es_data(index_name, query):
    es_response = elasticsearch.es_client.search(index=index_name, body=query)
    model = MODEL_MAPPING.get(index_name)
    return [model(**hit["_source"]) for hit in es_response["hits"]["hits"]] if model else []

async def insert_cities_into_elasticsearch():
    await insert_into_elasticsearch(CITY_INDEX, 'cities.xlsx')

async def insert_districts_into_elasticsearch():
    await insert_into_elasticsearch(DISTRICT_INDEX, 'districts.xlsx')

async def insert_wards_into_elasticsearch():
    await insert_into_elasticsearch(WARD_INDEX, 'wards.xlsx')

async def insert_regions_into_elasticsearch():
    await insert_into_elasticsearch(REGION_INDEX, 'regions.xlsx')

async def delete_cities():
    await delete_index_by_name(CITY_INDEX)

async def delete_districts():
    await delete_index_by_name(DISTRICT_INDEX)

async def delete_wards():
    await delete_index_by_name(WARD_INDEX)

async def delete_regions():
    await delete_index_by_name(REGION_INDEX)

async def get_cities():
    return await query_es_data(CITY_INDEX, {"query": {"match_all": {}}, "size": 65})

async def get_districts_by_city(city_code: str):
    return await query_es_data(DISTRICT_INDEX, {"query": {"match": {"city_code": city_code}}, "size": 1000})

async def get_wards_by_district(district_code: str):
    return await query_es_data(WARD_INDEX, {"query": {"match": {"district_code": district_code}}, "size": 1000})

async def get_regions():
    return await query_es_data(REGION_INDEX, {"query": {"match_all": {}}, "size": 65})

async def get_all_locations_by_user(token: str):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        location = collection.find_one({"user_id": user_info.id})
        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Lấy danh sách địa chỉ thành công",
            data={
                "default_location": location["default_location"] if location else None,
                "locations": location["locations"] if location else []
            }
        )
    except Exception as e:
        logger.error(f"Error getting all locations: {str(e)}")
        raise e

async def create_location(item: ItemLocationReq, token: str):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        location = collection.find_one({"user_id": user_info.id})
        location_id = generate_id("LOCATION")

        n_location = {
            "location_id": location_id,
            "name": item.name,
            "phone_number": item.phone_number,
            "address": item.address,
            "ward": item.ward,
            "district": item.district,
            "province": item.province,
            "province_code": item.province_code,
            "district_code": item.district_code,
            "ward_code": item.ward_code,
            "created_at": datetime.datetime.now()
        }
        if not location:
            collection.insert_one({
                "user_id": user_info.id,
                "default_location": location_id,
                "locations": [n_location]
            })
            return response.BaseResponse(
                status_code=status.HTTP_200_OK,
                message="Thêm địa chỉ thành công"
            )
        data_locations = location["locations"]
        if len(data_locations) >= 5:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Đã đạt giới hạn địa chỉ"
            )
        data_locations.append(n_location)
        if item.is_default or len(data_locations) == 1:
            collection.update_one({"user_id": user_info.id},
                              {"$set": {"locations": data_locations,
                                "default_location": location_id}})
        else:
            collection.update_one({"user_id": user_info.id},
                              {"$set": {"locations": data_locations}})
        return response.BaseResponse(
                status_code=status.HTTP_200_OK,
                message="Thêm địa chỉ thành công"
            )
    except Exception as e:
        logger.error(f"Error create location: {str(e)}")
        raise e

async def update_location(token: str, location_id: str, item: ItemLocationReq):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]
        location = collection.find_one({"user_id": user_info.id})
        updated = False
        new_locations = []
        is_default = item.is_default
        item.dict(exclude={"is_default"})
        for loc in location["locations"]:
            if loc["location_id"] == location_id:
                loc.update({k: v for k, v in item.dict().items() if v is not None})
                updated = True
            new_locations.append(loc)
        if not updated:
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy địa chỉ để cập nhật"
            )

        if is_default:
            collection.update_one({"user_id": user_info.id},
                                  {"$set": {"default_location": location_id}})

        collection.update_one({"user_id": user_info.id},
                              {"$set":{
                                    "locations": new_locations,
                             }})

        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Cập nhật địa chỉ thành công"
        )
    except Exception as e:
        logger.error(f"Error update location: {str(e)}")
        raise e

async def delete_location(token: str, location_id: str):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]

        result = collection.find_one({"user_id": user_info.id})
        locations = result["locations"]
        updated_locations = [loc for loc in locations if loc["location_id"] != location_id]
        if len(updated_locations) == len(locations):
            return response.BaseResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy địa chỉ để xóa"
            )

        update_data = {"locations": updated_locations}
        if result["default_location"] == location_id:
            if updated_locations:
                update_data["default_location"] = updated_locations[0]["location_id"]
            else:
                update_data["default_location"] = None

        collection.update_one({"user_id": user_info.id}, {"$set": update_data})

        return response.BaseResponse(
            status_code=status.HTTP_200_OK,
            message="Xóa địa chỉ thành công"
        )

    except Exception as e:
        logger.error(f"Error delete location: {str(e)}")
        raise e
