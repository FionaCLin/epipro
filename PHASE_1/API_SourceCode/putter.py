import pymongo
from pymongo import MongoClient
import json

client = MongoClient('mongodb://user001:admin12345@ds027483.mlab.com:27483/epipro_disease_report', 27017)
db = client['epipro_disease_report']
collection = db['diseases']
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
# mydict = {
#     'Melbourne',
#     'Geelong',
#     'Ballarat',
#     'Gendigo'
# }
mydict = {
    "unknown",
    "other",
    "anthrax cutaneous",
    "anthrax gastrointestinous",
    "anthrax inhalation",
    "botulism",
    "brucellosis",
    "chikungunya",
    "cholera",
    "cryptococcosis",
    "cryptosporidiosis",
    "crimean-congo haemorrhagic fever",
    "dengue",
    "diphteria",
    "ebola haemorrhagic fever",
    "ehec (e.coli)",
    "enterovirus 71 infection",
    "influenza a/h5n1",
    "influenza a/h7n9",
    "influenza a/h9n2",
    "influenza a/h1n1",
    "influenza a/h1n2",
    "influenza a/h3n5",
    "influenza a/h3n2",
    "influenza a/h2n2",
    "hand, foot and mouth disease",
    "hantavirus",
    "hepatitis a",
    "hepatitis b",
    "hepatitis c",
    "hepatitis d",
    "hepatitis e",
    "histoplasmosis",
    "hiv/aids",
    "lassa fever",
    "malaria",
    "marburg virus disease",
    "measles",
    "mers-cov",
    "mumps",
    "nipah virus",
    "norovirus infection",
    "pertussis",
    "plague",
    "pneumococcus pneumonia",
    "poliomyelitis",
    "q fever",
    "rabies",
    "rift valley fever",
    "rotavirus infection",
    "rubella",
    "salmonellosis",
    "sars",
    "shigellosis",
    "smallpox",
    "staphylococcal enterotoxin b",
    "thypoid fever",
    "tuberculosis",
    "tularemia",
    "vaccinia and cowpox",
    "varicella",
    "west nile virus",
    "yellow fever",
    "yersiniosis",
    "zika",
    "legionares",
    "listeriosis",
    "monkeypox"
}
for k in mydict:
    disease = {
        'name': k
    }
    collection.insert_one(disease)


# with open('report.json') as f:
    # file_data = json.load(f)

# collection.insert_one(file_data)
client.close()
