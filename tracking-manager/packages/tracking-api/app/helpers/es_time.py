from elasticsearch import helpers
from typing import List

from app.core import logger
from app.core.elasticsearch import create_index, index_data
from app.entities.time.request import TimeReq


def get_all_time(times: List[TimeReq]):
    try:
        time_records = []
        for time in times:
            record = {
                "route_id": time.route.id,
                "route_code": time.route.code,
                "vn_route": time.route.vn_route,
                "eng_route": time.route.eng_route,
                "range_time": time.range_time,
            }
            time_records.append(record)
        return time_records
    except Exception as e:
        logger.error("Failed to process time records:", error=e)
        return []

async def insert_es_time(time_data, index):
    try:
        await create_index(index)

        index_data(index, get_all_time(time_data))
        print(f"{index} inserted successfully")
    except helpers.BulkIndexError as e:
        print("Bulk indexing error:", e)
        for error in e.errors:
            print(error)