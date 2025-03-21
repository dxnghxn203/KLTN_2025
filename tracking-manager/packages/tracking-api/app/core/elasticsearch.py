import os

from dotenv import load_dotenv
from elasticsearch import Elasticsearch

load_dotenv()

es_host = os.getenv("ES_HOST")
es_port = os.getenv("ES_PORT")
es_user = os.getenv("ES_USER")
es_pw = os.getenv("ES_PW")

try:
    es_client = Elasticsearch([f"https://dxnghxn203-search-4561204506.us-east-1.bonsaisearch.net:443"], http_auth=("vqp2comkid", "jie24l3i6n"))
    es_client.ping()
    print("Connected to Elasticsearch!")
except Exception as e:
    print("Error connecting to Elasticsearch", e)