import os

import pandas as pd

from app.core import elasticsearch
from app.core import response
from app.entities.location.response import City, District, Ward, Region
from app.helpers.constant import CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX
from app.helpers.es_location import insert_es_cities, delete_index, insert_es_districts, insert_es_wards, \
    insert_es_regions


async def insert_cities_into_elasticsearch():
    excel_file = os.path.join('app/static', 'cities.xlsx')
    print("excel_file", excel_file)
    df = pd.read_excel(excel_file, engine='openpyxl')
    await insert_es_cities(df)

async def insert_districts_into_elasticsearch():
    excel_file = os.path.join('app/static', 'districts.xlsx')
    print("excel_file", excel_file)
    df = pd.read_excel(excel_file, engine='openpyxl')
    await insert_es_districts(df)

async def insert_wards_into_elasticsearch():
    excel_file = os.path.join('app/static', 'wards_with_long_lat.xlsx')
    print("excel_file", excel_file)
    df = pd.read_excel(excel_file, engine='openpyxl')
    await insert_es_wards(df)

async def insert_regions_into_elasticsearch():
    excel_file = os.path.join('app/static', 'regions.xlsx')
    print("excel_file", excel_file)
    df = pd.read_excel(excel_file, engine='openpyxl')
    await insert_es_regions(df)

async def delete_cities():
    delete_index(CITY_INDEX)

async def delete_districts():
    delete_index(DISTRICT_INDEX)

async def delete_wards():
    delete_index(WARD_INDEX)

async def delete_regions():
    delete_index(REGION_INDEX)

async def get_cities():
    query = {"query": {"match_all": {}}, "size": 65}
    es_response = elasticsearch.es_client.search(index=CITY_INDEX, body=query)
    data = [City(**hit["_source"]) for hit in es_response["hits"]["hits"]]
    return response.SuccessResponse(data=data)

async def get_districts_by_city(city_code: str):
    query = {"query": {"match": {"city_code": city_code}}, "size": 1000}
    es_response = elasticsearch.es_client.search(index=DISTRICT_INDEX, body=query)
    data = [District(**hit["_source"]) for hit in es_response["hits"]["hits"]]
    return response.SuccessResponse(data=data)

async def get_wards_by_district(district_code: str):
    query = {"query": {"match": {"district_code": district_code}}, "size": 1000}
    es_response = elasticsearch.es_client.search(index=WARD_INDEX, body=query)
    data = [Ward(**hit["_source"]) for hit in es_response["hits"]["hits"]]
    return response.SuccessResponse(data=data)

async def get_regions():
    query = {"query": {"match_all": {}}, "size": 65}
    es_response = elasticsearch.es_client.search(index="regions", body=query)
    data = [Region(**hit["_source"]) for hit in es_response["hits"]["hits"]]
    return response.SuccessResponse(data=data)
