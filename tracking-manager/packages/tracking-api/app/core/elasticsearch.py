import os

from dotenv import load_dotenv
from elasticsearch import Elasticsearch

load_dotenv()

es_host = os.getenv("ES_HOST")
es_port = os.getenv("ES_PORT")
es_user = os.getenv("ES_USER")
es_pw = os.getenv("ES_PW")

#es_client = Elasticsearch([f"http://{es_host}:{es_port}"], http_auth=(es_user, es_pw))
