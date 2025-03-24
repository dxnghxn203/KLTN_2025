import pandas as pd
from opensearchpy import helpers

from app.core import elasticsearch, logger
from app.helpers.constant import CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX

def index_data(index_name, data):
    helpers.bulk(
        elasticsearch.es_client,
        [{"_index": index_name, "_source": value} for value in data]
    )

async def create_indices():
    try:
        for index in [CITY_INDEX, DISTRICT_INDEX, WARD_INDEX, REGION_INDEX]:
            if not elasticsearch.es_client.indices.exists(index):
                elasticsearch.es_client.indices.create(index=index)
        logger.info("Successfully [create_indices]")
    except Exception as e:
        logger.error("Failed [create_indices] :", error=e)

def get_all_locations(df, columns_map):
    try:
        locations = df[list(columns_map.keys())].drop_duplicates().rename(columns=columns_map)
        return locations.to_dict(orient='records')
    except Exception as e:
        logger.error(f"Failed to extract location data: {e}")
        return []

async def insert_es_data(index, data_func, df):
    try:
        await create_indices()
        index_data(index, data_func(df))
        logger.info(f"Inserted data into {index} successfully")
    except helpers.BulkIndexError as e:
        logger.error(f"Bulk indexing error in {index}: {e}")

def get_all_cities(df):
    return get_all_locations(df, {
        'Tỉnh Thành Phố': 'name',
        'Tỉnh Thành Phố Tiếng Anh': 'full_name_en',
        'Tiếng Anh': 'name_en',
        'Tên Mã TP': 'code_name',
        'Mã Đơn Vị': 'unit_id',
        'Mã Vùng': 'region_id',
        'Cấp': 'unit_name',
        'Mã TP': 'code',
        'Miền': 'domestic_name',
        'Miền Tiếng Anh': 'domestic_name_en'
    })

def get_all_districts(df):
    return get_all_locations(df, {
        'Quận Huyện': 'name',
        'Quận Huyện Tiếng Anh': 'full_name_en',
        'Tiếng Anh': 'name_en',
        'Tên Mã QH': 'code_name',
        'Mã Đơn Vị': 'unit_id',
        'Cấp': 'unit_name',
        'Mã QH': 'code',
        'Mã TP': 'city_code'
    })

def get_all_wards(df):
    df['Mã PX'] = pd.to_numeric(df['Mã PX'], errors='coerce')  # Ensure numeric IDs
    return get_all_locations(df, {
        'Phường Xã': 'name',
        'Phường Xã Tiếng Anh': 'full_name_en',
        'Tiếng Anh': 'name_en',
        'Tên Mã PX': 'code_name',
        'Mã Đơn Vị': 'unit_id',
        'Cấp': 'unit_name',
        'Mã PX': 'code',
        'Mã QH': 'district_code',
        'Mã TP': 'city_code'
    })

def get_all_regions(df):
    return get_all_locations(df, {
        'Mã Vùng': 'id',
        'Tên Vùng': 'name',
        'Tên Vùng Tiếng Anh': 'name_en',
        'Tên Mã Vùng': 'code_name',
        'Tên Mã Vùng Tiếng Anh': 'code_name_en',
        'Miền': 'domestic_name',
        'Miền Tiếng Anh': 'domestic_name_en'
    })

async def insert_es_cities(df): await insert_es_data(CITY_INDEX, get_all_cities, df)
async def insert_es_districts(df): await insert_es_data(DISTRICT_INDEX, get_all_districts, df)
async def insert_es_wards(df): await insert_es_data(WARD_INDEX, get_all_wards, df)
async def insert_es_regions(df): await insert_es_data(REGION_INDEX, get_all_regions, df)

def delete_index(index_name):
    try:
        if elasticsearch.es_client.indices.exists(index=index_name):
            elasticsearch.es_client.indices.delete(index=index_name)
            logger.info(f"Successfully deleted index: {index_name}")
        else:
            logger.info(f"Index {index_name} does not exist.")
    except Exception as e:
        logger.error("Failed to delete index:", error=e)
