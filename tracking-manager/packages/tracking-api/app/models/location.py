import os

import pandas as pd

from app.core import elasticsearch
from app.entities.location.response import City, District, Ward, Region
from app.helpers.constant import CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX
from app.helpers.es_location import insert_es_cities, delete_index, insert_es_districts, insert_es_wards, \
    insert_es_regions

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
