import pymongo
from pymongo import MongoClient
import json

client = MongoClient('mongodb://user001:admin12345@ds027483.mlab.com:27483/epipro_disease_report', 27017)
db = client['epipro_disease_report']
collection = db['test_location']
collection.create_index([('$**', 'text')])

# mydict = {
#     'Sydney',
#     'Newcastle',
#     'Central Coast',
#     'Wollongong',
#     'Albury',
#     'Maitland',
#     'Wagga Wagga'
# }
mydict = {
    'Melbourne',
    'Geelong',
    'Ballarat',
    'Gendigo'
}
for k in mydict:
    city = {
        'country': 'Australia',
        'state': 'Victoria',
        'city': k
    }
    collection.insert_one(city)



# with open('report.json') as f:
    # file_data = json.load(f)

# collection.insert_one(file_data)
client.close()
