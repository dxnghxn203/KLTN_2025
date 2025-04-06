import json
import os

from app.core import elasticsearch, logger
from app.core import response
from app.core.elasticsearch import delete_index
from app.entities.fee.request import FeeReq
from app.entities.fee.response import FeeRes
from app.helpers.es_fee import insert_es_fee

async def insert_fee_into_elasticsearch(file, index):
    if await elasticsearch.index_has_data(index):
        logger.info(f"Index {index} đã có dữ liệu, bỏ qua insert!")
        return
    json_file = os.path.join('app/static', file)
    print("json_file:", json_file)
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print(data)
        fee_data = [FeeReq(**item) for item in data]
        await insert_es_fee(fee_data, index)
        print(f"Inserted {index} into Elasticsearch successfully.")

    except Exception as e:
        print(f"Error reading or inserting {index}: {e}")

async def delete_fee(index):
    delete_index(index)

async def get_fee(index):
    query = {"query": {"match_all": {}}, "size": 1000}
    es_response = elasticsearch.es_client.search(index=index, body=query)
    data = [FeeRes(**hit["_source"]) for hit in es_response["hits"]["hits"]]
    return response.SuccessResponse(data=data)