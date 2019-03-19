import pymongo
from pymongo import MongoClient
import json
#for testing
if __name__ == '__main__':
    client = MongoClient('mongodb://user001:admin12345@ds027483.mlab.com:27483/epipro_disease_report', 27017)
    db = client['epipro_disease_report']
    collection = db['test_report']
    for t in collection.find():
        print(t)
    print()
    collection2 = db['test_location']
    for t in collection2.find():
        print(t)