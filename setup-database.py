from pymongo import MongoClient
from PHASE_1.API_SourceCode import config
import os
import json

collections = ['location', 'key_terms', 'diseases', 'reports']
dir_path = os.path.dirname(os.path.realpath(__file__))

locationsjs = json.load(
    open(os.path.join(dir_path, 'PHASE_1/TestScripts/sample_output/locations.json'), 'r'))

key_termsjs = json.load(
    open(os.path.join(dir_path, 'PHASE_1/TestScripts/sample_output/key-terms.seed.json'), 'r'))

diseasejs = json.load(
    open(os.path.join(dir_path, 'PHASE_1/TestScripts/sample_output/disease.json'), 'r'))

disease_reportjs = json.load(
    open(os.path.join(dir_path, 'PHASE_1/TestScripts/sample_output/sample_disease_report.json'), 'r'))

try:
    client = MongoClient(config.MONGO_URI)
    dbs = client.list_database_names()
    for DB in config.MONGO_DBS:
        if DB in dbs:
            client.drop_database(DB)

        db = client[DB]

        location = db.location
        for l in locationsjs:
            l['9999'] = 'test'
            location.insert_one(l)
        res_locations = location.find({}, {"_id": 0})
        for i in res_locations:
            print(i)

        key_terms = db.key_terms
        for k in key_termsjs:
            key_terms.insert_one(k)
        res_key_terms = key_terms.find({}, {"_id": 0})

        diseases = db.diseases
        for d in diseasejs:
            diseases.insert_one(d)
        res_diseases = diseases.find({}, {"_id": 0})

        reports = db.reports
        for r in disease_reportjs:
            reports.insert_one(r)
        res_reports = reports.find({}, {"_id": 0})

except:
    print("Mongodb is not installed")
