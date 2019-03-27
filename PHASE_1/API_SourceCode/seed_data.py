import pymongo
from pymongo import MongoClient
import json

client = MongoClient(
    'mongodb://user:password@host:27017/database', 27017)
db = client['database']
collection.create_index([('$**', 'text')])

locations = {
    'New South Wales': [
        'Sydney',
        'Newcastle',
        'Central Coast',
        'Wollongong',
        'Albury',
        'Maitland',
        'Wagga Wagga'
    ],
    'Victoria': [
        'Melbourne',
        'Geelong',
        'Ballarat',
        'Gendigo'
    ]
}

for k in ['New South Wales', 'Victoria']:
    collection = db['test_location']
    for loc in locations[k]:
        city = {
            'country': 'Australia',
            'state': 'New South Wales',
            'city': k
        }
        collection.insert_one(city)


keyterms = {
    "general": [
        'none':[
            "Outbreak",
            "Infection",
            "Fever",
            "Virus",
            "Epidemic",
            "Infectious",
            "Illness",
            "Bacteria",
            "Emerging",
            "Unknown virus",
            "Myster(ious)y disease"
        ]
    ],
    "specific": [
        'none':[

            "Zika",
            "MERS",
            "Salmonella",
            "Legionnaire",
            "Measles"
        ],
        'A Agents':[

            "Anthrax",
            "Botulism",
            "Plague",
            "Smallpox and other related pox viruses",
            "Tularemia",
            "Junin Fever",
            "Machupo Fever",
            "Guanarito Fever",
            "Chapare Fever",
            "Lassa Fever",
            "Lujo Fever",
            "Hantavirus",
            "Rift Valley Fever",
            "Crimean Congo Hemorrhagic Fever",
            "Dengue",
            "Ebola",
            "Marburg"
        ]
    ]
}
for t in ['specific', 'general']:
    for k in keyterms[t]:
        for j in keyterms[t][k]:
            term = {
                'type': t,
                'category': k,
                'name': j
            }
            collection.insert_one(term)

with open('../TestScripts/sample_output/sample_disease_report.json') as f:
    file_data = json.load(f)

collection.insert_one(file_data)
client.close()
