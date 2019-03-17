# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#### DON'T KNOW WHAT THIS FOR #####
# from lib import *
# [START gae_python37_app]


from flask import Flask, Blueprint
# not sure if we need this in localhost
from flask import Flask, url_for, redirect, render_template
from flask_restplus import Resource, Api
from flask import request
from flask_restplus import fields
from flask_restplus import inputs
from flask_restplus import reqparse
import config
import pymongo
from pymongo import MongoClient
import enum
import json



# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
blueprint = Blueprint('api', __name__, url_prefix='/api/v1')
app.config['RESTPLUS_MASK_SWAGGER'] = False
api = Api(blueprint,
          doc='/doc/',
          version='1.0',
          default="EpiPro",  # Default namespace
          title="EpiPro REST API Documentation",  # Documentation Title
          description="This is a EpiPro App REST API.\r\n SENG3011 workshop project"
            )  # Documentation Description

app.register_blueprint(blueprint)

client = MongoClient(config.MONGO_URI,config.MONGO_PORT)
db = client[config.MONGO_DB]

parser = reqparse.RequestParser()

#############################################################################################
#   MODEL   #
#####  REPSONSE for /api/reports/locations/<:id> #####
#     {
#       geoname_id: number,
#       county: string,
#       location: string,
#       url: string,  --geoname_url
#     }
location = api.model('location_info', {
    'geoname_id': fields.Integer,
    'country': fields.String,
    'location': fields.String,
    'url': fields.String
})

#####  RESPONSE for /api/reports/key_terms
#      {id, type, category and name}
key_term = api.model('key_term', {
    'keyTerm_id': fields.Integer,
    'type': fields.String(enum=['general', 'specific']),
    'category': fields.String,
    'name': fields.String
})

#####  RESPONSE for /api/reports
#       This is a DISEASE REPORT json format
reported_event = api.model('report-event', {
    # TO DO : figure out the range
    'type': fields.String,
    # TO DO: choose the right format
    'date': fields.DateTime,
    'location': fields.Nested(location),
    'number-affected':fields.Integer
})

report = api.model('report', {
    'disease': fields.String,
    # TO DO: figure out field with a range
    'syndrome': fields.String,
    'reported_events': fields.List(fields.Nested(reported_event))
})

disease_report_model = api.model('disease-report',{
    'url': fields.String,
    # TO DO: more look on the date format
    'date_of_publiction': fields.DateTime,
    'headline': fields.String,
    'main_text': fields.String,
    'reports': fields.List(fields.Nested(report))
})

filter_fields = api.model('filter',{
    'start-date': fields.DateTime,
    'end-date': fields.DateTime,
    'key_terms': fields.String,
    # geoname_id
    'location': fields.Integer
   })

#####################################################################################################

# default index page render to REST api doc
@app.route('/')
def index():
    return render_template("index.html", token=api.base_url+'doc')

# # locations
# GET /api/reports/locations
# -- Index locations
#   Response an array of locations
@api.route('/reports/locations')
class locations(Resource):

    @api.marshal_with(location, as_list=True)
    @api.response(200, 'Data fetched successfully')
    # TO DO: specify the reason
    @api.response(400, 'Bad request')
    @api.response(404, 'No data found')
    @api.doc(description="Get all the disease related locations")
    # @api.expect([location], validate=True)
    def get(self):
        return

# GET /api/reports/locations/:geonameID
# -- get a single location by id
#     Response a single location object:
#     {
#       geoname_id: number,
#       county: string,
#       location: string,
#       url: string,  --geoname_url
#     }
@api.route('/reports/locations/<int:geoname_id>')
class locations_id(Resource):

    @api.marshal_with(location)
    @api.response(200, 'Specific location info fetched successfully')
    # TO DO: specify the reason
    @api.response(400, 'Bad request')
    @api.response(404, 'No data found')
    @api.doc(description="Get the location info with given geoname id")
    # @api.expect(location, validate=True)
    def get(self):
        return


######################
##      CLOSED      ##
######################
# # key_terms
# GET /api/reports/key-terms
# -- Index all current key_terms with given query
#    Query: [GENERAL]|[SPECIFIC]
#    Category: sub-types under sepcific key terms
#    Response an array of key_terms, each key_term contains id, type and name
@api.route('/reports/key-terms/<string:term_type>')
class key_terms(Resource):

    @api.response(200, 'Key term list fetched successfully', key_term)
    @api.response(400, 'Bad request, check the parameters')
    @api.response(404, 'No data found')
    @api.param('category','Optional, find out A agent keywords')
    @api.doc(params={'term_type':'Can ONLY be [general] or [specific]'})
    @api.doc(description="Get all the key terms if no additional query,\
                otherwise, get all keys from [general] or [specific] type")
    # @api.expect([key_term], validate=True)
    def get(self, term_type):
        term_type = term_type.lower()
        if term_type not in ['general', 'specific']:
            return { 'message' : 'make sure that term-type can only be general or specific' }, 400
        collection = db['Key_Terms']

        result = []
        my_query = { 'type' : term_type }
        query = request.args.get('category')

        if query is not None:
            if term_type == "specific":
                query = query.lower()
                my_query = { 'type' : term_type, 'category': query }
            else:
                return { 'message': 'category is under specific type, please enter again' }, 400

        cursor = collection.find(my_query)
        for entry in cursor:
            e = {}
            e['type'] = entry['type']
            e['category'] = entry['category']
            e['name'] = entry['name']
            result.append(e)
        if not result:
            return { 'message': 'Sorry, there is no data matched' }, 404
        return result, 200





# # disease reports
# GET /api/reports
# -- Fetch disease reports
#    Responses the recent 100 reports by default
#    Query(optional):
#    pagination -- this refers to the design from atlassian
#    reference: https://developer.atlassian.com/server/confluence/pagination-in-the-rest-api/
#       -start::integer  : start from the n-th report
#       -limit::integer  : limit to the number of responseed reports
# TO DO: add sort function

@api.route('/reports/all')
class disease_reports(Resource):

    @api.marshal_with(disease_report_model, as_list=True)
    @api.response(200, 'Specific location info fetched successfully')
    # TO DO: specify the reason
    @api.response(400, 'Bad request')
    @api.response(404, 'No data found')
    # TO DO：start and limit should be filled at the same time
    @api.param('start','Optional Query, start from the n-th report')
    @api.param('limit','Optional Query, limit to the number of responseed reports')
    @api.doc(description="Get all disease reports")
    # @api.expect([disease_report_model], validate=True)
    def get(self):
        return


# GET /api/reports/filter
# -- Fetch disease reports by start date, end date, location, key_terms
#    Response an array of disease reports
#    Query type
#    {
#       start-date: string,
#       end-date: string,
#       key_terms: list<string>,
#       location: geoname_id
#    }
#   TO DO: HOW TO DEAL WITH EMPTY FIELD?
@api.route('/reports/filter')
class disease_report_with_filter(Resource):

    # @api.expect(filter_fields, validate=True)
    @api.marshal_with(disease_report_model, as_list=True)
    @api.response(200, 'Specific location info fetched successfully')
    # TO DO: specify the reason
    @api.response(400, 'Bad request')
    @api.response(404, 'No data found')
    @api.param('Start-date','Optional Query, the start date of period of interest')
    @api.param('End-date','Optional Query, the end date of period of interest')
    @api.param('Key-terms','Optional Query, the key terms user want to search')
    @api.param('Location','Optional Query, input a location name (city/country/state etc.)')
    @api.doc(description="Get all reports according to the filter")
    def get(self):
        return

#######################################################################################################



if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
