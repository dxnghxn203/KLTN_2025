import os

from dotenv import load_dotenv
from elasticsearch import Elasticsearch

load_dotenv()

es_host = os.getenv("ES_HOST")
es_port = os.getenv("ES_PORT")
es_user = os.getenv("ES_USER")
es_pw = os.getenv("ES_PW")

try:
    es_client = Elasticsearch([f"{es_host}:{es_port}"], basic_auth=(es_user, es_pw))
    print(f"es_client = {es_client}")
    es_client.ping()
    print("Connected to Elasticsearch!")
except Exception as e:
    print("Error connecting to Elasticsearch", e)