import datetime
import os

import pandas as pd
from starlette import status

from app.core import elasticsearch, database, logger, response
from app.entities.location.request import ItemLocationReq
from app.entities.location.response import City, District, Ward, Region
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

async def create_location(item: ItemLocationReq, token: str):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]

        item_dict = item.dict()
        item_dict["location_id"] = generate_id("LOCATION")
        item_dict["user_id"] = user_info.id
        item_dict["created_at"] = datetime.datetime.now()
        item_dict["updated_at"] = datetime.datetime.now()

        insert_result = collection.insert_one(item_dict)

        logger.info(f"[create_location] Thêm địa chỉ thành công cho user {user_info.id}")
        return response.BaseResponse(
            status_code=status.HTTP_201_CREATED,
            message="Thêm địa chỉ thành công"
        )
    except Exception as e:
        logger.error(f"Error create location: {str(e)}")
        raise e

async def update_location(token: str, location_id: str, item: ItemLocationReq):
    try:
        user_info = await user.get_current(token)
        collection = database.db[collection_name]

        updated_data = item.dict()
        updated_data["updated_at"] = datetime.datetime.now()

        result = collection.update_one(
            {"user_id": user_info.id, "location_id": location_id},
            {"$set": updated_data}
        )

        logger.info(f"[update_location] Matched: {result.matched_count}, Modified: {result.modified_count}")

        if result.matched_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không tìm thấy địa chỉ để cập nhật"
            )

        if result.modified_count == 0:
            raise response.JsonException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Không có thay đổi trong dữ liệu"
            )

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

        result = collection.delete_one({"user_id": user_info.id, "location_id": location_id})

        if result.deleted_count > 0:
            return response.BaseResponse(
                status_code=status.HTTP_200_OK,
                message="Xóa địa chỉ thành công"
            )

        raise response.JsonException(
            status_code=status.HTTP_400_BAD_REQUEST,
            message="Không tìm thấy địa chỉ để xóa"
        )

    except Exception as e:
        logger.error(f"Error delete location: {str(e)}")
        raise e
