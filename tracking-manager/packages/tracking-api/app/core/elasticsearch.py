import os

from dotenv import load_dotenv
from opensearchpy import OpenSearch, helpers

from app.core import logger

load_dotenv()

try:
    es_host = os.getenv("ES_HOST")
    es_port = os.getenv("ES_PORT")
    es_user = os.getenv("ES_USER")
    es_pw = os.getenv("ES_PW")

    es_client = OpenSearch(
        hosts=[es_host],
        http_auth=(es_user, es_pw),
        use_ssl=True,
        verify_certs=True
    )

    es_client.ping()
    print("Connected to Elasticsearch!")
except Exception as e:
    print("Error connecting to Elasticsearch", e)

def index_data(index_name, data):
    try:
        helpers.bulk(es_client, [{"_index": index_name, "_source": value} for value in data])
        logger.info(f"Indexed data into {index_name} successfully")
    except helpers.BulkIndexError as e:
        logger.error(f"Bulk indexing error in {index_name}: {e}", exc_info=True)

async def index_has_data(index_name):
    try:
        es_response = es_client.count(index=index_name)
        return es_response["count"] > 0
    except Exception as e:
        logger.error(f"Lỗi khi kiểm tra index {index_name}: {e}")
        return False

async def create_index(index_name):
    try:
        if not es_client.indices.exists(index=index_name):
            es_client.indices.create(index=index_name)
            logger.info(f"Created index {index_name} successfully")
        else:
            logger.info(f"Index {index_name} already exists")
    except Exception as e:
        logger.error(f"Failed [create_indices] {index_name} : {e}")

def delete_index(index_name):
    try:
        if es_client.indices.exists(index=index_name):
            es_client.indices.delete(index=index_name)
            logger.info(f"Successfully deleted index: {index_name}")
        else:
            logger.info(f"Index {index_name} does not exist.")
    except Exception as e:
        logger.error("Failed to delete index:", error=e)
