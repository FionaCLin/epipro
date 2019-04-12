import os
import sys
import re


# There are three different ways to store the data in the application.
# You can choose 'datastore', 'cloudsql', or 'mongodb'. Be sure to
# configure the respective settings for the one you choose below.
# You do not have to configure the other data backends. If unsure, choose
# 'datastore' as it does not require any additional configuration.
DATA_BACKEND = 'mongodb'

# Google Cloud Project ID. This can be found on the 'Overview' page at
# https://console.developers.google.com
PROJECT_ID = 'epiproapp'

# Mongo configuration
# If using mongolab, the connection URI is available from the mongolab control
# panel. If self-hosting on compute engine, replace the values below.

##################################################################################################################
#!!!!!!!!Don't delete this file and copy this one as sample only!!!!!!!!!!
#!!!!!!!!Don't delete this file and copy this one as sample only!!!!!!!!!!
#!!!!!!!!Don't delete this file and copy this one as sample only!!!!!!!!!!
#!!!!!!!!Don't delete this file and copy this one as sample only!!!!!!!!!!
#!!!!!!!!Don't delete this file and copy this one as sample only!!!!!!!!!!
#!!!!!!!!Don't delete this file and copy this one as sample only!!!!!!!!!!
#!!!!!!!!Don't delete this file and copy this one as sample only!!!!!!!!!!
#!!!!!!!!Don't delete this file and copy this one as sample only!!!!!!!!!!
##################################################################################################################


if re.match(r'.*test.*', sys.argv[0]):
    # update this and save as config.py
    MONGO_PORT = 27017
    PORT = 5000
    MONGO_DB = 'epipro_test'
    MONGO_URI ='mongodb://localhost:{}/{}'.format(MONGO_PORT, MONGO_DB)
else:
    MONGO_PORT = 27017
    PORT = 8080
    MONGO_DB = 'epipro_dev'
    MONGO_URI = 'mongodb://localhost:{}/{}'.format(MONGO_PORT, MONGO_DB)
MONGO_DBS = ['epipro_test', 'epipro_dev']
