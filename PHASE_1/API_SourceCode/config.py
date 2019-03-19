import os


# There are three different ways to store the data in the application.
# You can choose 'datastore', 'cloudsql', or 'mongodb'. Be sure to
# configure the respective settings for the one you choose below.
# You do not have to configure the other data backends. If unsure, choose
# 'datastore' as it does not require any additional configuration.
DATA_BACKEND = 'mongodb'

# Google Cloud Project ID. This can be found on the 'Overview' page at
# https://console.developers.google.com
PROJECT_ID = 'your-project-id'

# Mongo configuration
# If using mongolab, the connection URI is available from the mongolab control
# panel. If self-hosting on compute engine, replace the values below.


##update this and save as config.py
MONGO_URI = \
    'mongodb://user001:admin12345@ds027483.mlab.com:27483/epipro_disease_report'
MONGO_PORT=27017
MONGO_DB='epipro_disease_report'
