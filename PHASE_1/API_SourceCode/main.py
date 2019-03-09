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

##### DON'T KNOW WHAT THIS FOR #####
# from lib import *
# [START gae_python37_app]

from flask import Flask, Blueprint
# not sure if we need this in localhost
from flask import Flask, url_for, redirect
from flask_restplus import Resource, Api
from flask import request
from flask_restplus import fields
from flask_restplus import inputs
from flask_restplus import reqparse

import enum




# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
blueprint = Blueprint('api', __name__, url_prefix='/v1')
app.config['RESTPLUS_MASK_SWAGGER'] = False
api = Api(blueprint,
          doc='/doc/',
          version='1.0',
          default="EpiPro",  # Default namespace
          title="EpiPro REST API Documentation",  # Documentation Title
          description="This is a EpiPro App REST API.\r\n SENG3011 workshop project"
            )  # Documentation Description

app.register_blueprint(blueprint)


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
#      {id, type and name}
key_term = api.model('key_term', {
    'keyTerm_id': fields.Integer,
    'type': fields.String(enum=['general', 'specific']),
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
    return redirect(url_for('api.doc'))

# # locations
# GET /api/reports/locations 
# -- Index locations 
#   Response an array of locations
@api.route('/api/reports/locations')
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
@api.route('/api/reports/locations/<int:geoname_id>')
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


# # key_terms
# GET /api/reports/key-terms 
# -- Index all current key_terms with given query
#    Query: [GENERAL]|[SPECIFIC]
#    Response an array of key_terms, each key_term contains id, type and name

@api.route('/api/reports/key-terms/<any(general, specific):category>')
class key_terms(Resource):

    @api.marshal_with(key_term, as_list=True)
    @api.response(200, 'Key term list fetched successfully')
    # TO DO: specify the reason
    # restrict the category, return the right status code
    @api.response(400, 'Bad request')
    @api.response(404, 'No data found')
    # @api.param('category','Optional Query, should be [general] or [specific]')
    @api.doc(params={'category':'Can ONLY be [general] or [specific]'})
    @api.doc(description="Get all the key terms if no additional query,\
                otherwise, get all keys from [general] or [specific] catagory")
    # @api.expect([key_term], validate=True)
    def get(self, category):
        return


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

@api.route('/api/reports/all')
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
@api.route('/api/reports/filter')
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
