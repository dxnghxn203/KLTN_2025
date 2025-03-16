import pandas as pd
from elasticsearch import helpers

from app.core import elasticsearch, logger
from app.helpers.constant import CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX


def index_data(index_name, data):
    helpers.bulk(elasticsearch.es_client, [{"_index": index_name, "_source": value} for value in data])


async def create_indices():
    # Creates Elasticsearch indices if they don't exist.
    try:
        for index in [CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX]:
            if not elasticsearch.es_client.indices.exists(index=index):
                elasticsearch.es_client.indices.create(index=index)

        logger.info("Successfully [create_indices]")

    except Exception as e:
        logger.error("Failed [create_indices] :", error=e)


def get_all_cities(df):
    try:
        # Extract unique city data
        cities = df[['Tỉnh Thành Phố', 'Tỉnh Thành Phố Tiếng Anh', 'Tiếng Anh',
                     'Tên Mã TP', 'Mã Đơn Vị', 'Mã Vùng', 'Cấp',
                     'Mã TP', 'Miền', 'Miền Tiếng Anh']].drop_duplicates().rename(
            columns={'Tỉnh Thành Phố': 'name', 'Tỉnh Thành Phố Tiếng Anh': 'full_name_en',
                     'Tiếng Anh': 'name_en', 'Tên Mã TP': 'code_name', 'Mã Đơn Vị': 'unit_id',
                     'Mã Vùng': 'region_id', 'Cấp': 'unit_name', 'Mã TP': 'code',
                     'Miền': 'domestic_name', 'Miền Tiếng Anh': 'domestic_name_en'})
        return cities.to_dict(orient='records')
    except Exception as e:
        logger.error("Failed [get_all_cities] :", error=e)

def get_all_districts(df):
    try:
        # Extract unique district data
        districts = df[['Quận Huyện', 'Quận Huyện Tiếng Anh', 'Tiếng Anh',
                        'Tên Mã QH', 'Mã Đơn Vị', 'Cấp', 'Mã QH', 'Mã TP']].drop_duplicates().rename(
            columns={'Quận Huyện': 'name', 'Quận Huyện Tiếng Anh': 'full_name_en',
                     'Tiếng Anh': 'name_en', 'Tên Mã QH': 'code_name', 'Mã Đơn Vị': 'unit_id',
                     'Cấp': 'unit_name', 'Mã QH': 'code', 'Mã TP': 'city_code'})
        return districts.to_dict(orient='records')
    except Exception as e:
        logger.error("Failed [get_all_districts] :", error=e)

def get_all_wards(df):
    try:
        # Extract unique ward data
        wards = df[['Phường Xã', 'Phường Xã Tiếng Anh', 'Tiếng Anh',
                    'Tên Mã PX', 'Mã Đơn Vị', 'Cấp', 'Mã PX', 'Mã QH', 'Mã TP', 'Latitude',
                    'Longitude']].drop_duplicates()
        wards['Mã PX'] = pd.to_numeric(wards['Mã PX'], errors='coerce')
        wards = wards.rename(
            columns={'Phường Xã': 'name', 'Phường Xã Tiếng Anh': 'full_name_en',
                     'Tiếng Anh': 'name_en', 'Tên Mã PX': 'code_name', 'Mã Đơn Vị': 'unit_id',
                     'Cấp': 'unit_name', 'Mã PX': 'code', 'Mã QH': 'district_code', 'Mã TP': 'city_code',
                     'Latitude': 'latitude', 'Longitude': 'longitude'})
        return wards.fillna('').to_dict(orient='records')
    except Exception as e:
        logger.error("Failed [get_all_wards] :", error=e)

def get_all_regions(df):
    try:
        # Extract region data
        regions = df[['Mã Vùng', 'Tên Vùng', 'Tên Vùng Tiếng Anh',
                     'Tên Mã Vùng', 'Tên Mã Vùng Tiếng Anh',
                      'Miền', 'Miền Tiếng Anh']].drop_duplicates().rename(
            columns={'Mã Vùng': 'id', 'Tên Vùng': 'name', 'Tên Vùng Tiếng Anh': 'name_en',
                     'Tên Mã Vùng': 'code_name', 'Tên Mã Vùng Tiếng Anh': 'code_name_en',
                     'Miền': 'domestic_name', 'Miền Tiếng Anh': 'domestic_name_en'})
        return regions.to_dict(orient='records')
    except Exception as e:
        logger.error("Failed [get_all_regions] :", error=e)

async def insert_es_cities(df):
    try:
        await create_indices()

        index_data(CITY_INDEX, get_all_cities(df))
        print("Cities inserted successfully")
    except helpers.BulkIndexError as e:
        print("Bulk indexing error:", e)
        for error in e.errors:
            print(error)


async def insert_es_districts(df):
    try:
        await create_indices()

        index_data(DISTRICT_INDEX, get_all_districts(df))
        print("Districts inserted successfully")
    except helpers.BulkIndexError as e:
        print("Bulk indexing error:", e)
        for error in e.errors:
            print(error)


async def insert_es_wards(df):
    try:
        await create_indices()

        index_data(WARD_INDEX, get_all_wards(df))
        print("Wards inserted successfully")
    except helpers.BulkIndexError as e:
        print("Bulk indexing error:", e)
        for error in e.errors:
            print(error)

async def insert_es_regions(df):
    try:
        await create_indices()

        index_data(REGION_INDEX, get_all_regions(df))
        print("Regions inserted successfully")
    except helpers.BulkIndexError as e:
        print("Bulk indexing error:", e)
        for error in e.errors:
            print(error)

def delete_index(index_name):
    try:
        if elasticsearch.es_client.indices.exists(index=index_name):
            elasticsearch.es_client.indices.delete(index=index_name)
            logger.info(f"Successfully deleted index: {index_name}")
        else:
            logger.info(f"Index {index_name} does not exist.")
    except Exception as e:
        logger.error("Failed to delete index:", error=e)
