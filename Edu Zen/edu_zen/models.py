from pymongo import MongoClient
from edu_zen.config import Config

def create_mongo_client(mongo_uri = Config.MONGO_URI):
    if not mongo_uri:
        raise ValueError("MongoDB URI not found in Config")
    return MongoClient(mongo_uri)

def init_database(client, db_name):
    return client.get_database(db_name)

def init_collection(db_name, coll_name):
    return db_name.get_collection(coll_name)


req_coll = ["student_details","mcq_questions","para_questions","choose_questions","rating_questions","survey_responses"]
db_name = "edu_zen_db"
dbs = {name: init_collection(init_database(create_mongo_client(), db_name), name) for name in req_coll}