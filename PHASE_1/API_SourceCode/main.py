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
from flask import Flask, url_for, redirect, render_template
from flask_restplus import Resource, Api
from flask import request
from flask_cors import CORS
from flask_restplus import fields
from flask_restplus import inputs
from flask_restplus import reqparse
import logging
import config
import pymongo
from pymongo import MongoClient
import enum
import re
from datetime import datetime, time
import date_tool as DT

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
blueprint = Blueprint('api', __name__, url_prefix='/api/v1')
app.config['RESTPLUS_MASK_SWAGGER'] = False
api = Api(
    blueprint,
    doc='/doc/',
    version='1.0',
    default="EpiPro",  # Default namespace
    title="EpiPro REST API Documentation",  # Documentation Title
    description="This is a EpiPro App REST API.\r\n SENG3011 workshop project"
)  # Documentation Description

CORS(app)
app.register_blueprint(blueprint)

client = MongoClient(config.MONGO_URI, config.MONGO_PORT)
db = client[config.MONGO_DB]

parser = reqparse.RequestParser()

LOCATION = 'location'
KEY_TERMS = 'key_terms'
REPORTS = 'reports'
#############################################################################################
#   MODEL   #
#####  REPSONSE for /api/reports/locations/<:id> #####
#     {
#       county: string,
#       state: string,
#       city: string
#     }
location = api.model(
    'location_info',
    {
        'country': fields.String,
        'state': fields.String,
        'city': fields.String,
    })

# RESPONSE for /api/reports/key_terms
#      {id, type, category and name}
key_term = api.model(
    'key_term',
    {
        'keyTerm_id': fields.Integer,
        'type': fields.String(enum=['general', 'specific']),
        'category': fields.String,
        'name': fields.String
    })

# RESPONSE for /api/reports
#       This is a DISEASE REPORT json format
location_detail = api.model(
    'location_detail',
    {
        'country': fields.String,
        'location': fields.String
    })

reported_event = api.model(
    'report-event',
    {
        'type': fields.String,
        # TO DO: choose the right format
        'date': fields.DateTime,
        'location': fields.Nested(location_detail),
        'number-affected': fields.Integer
    })

report = api.model(
    'report',
    {
        'disease': fields.List(fields.String),
        'syndrome': fields.List(fields.String),
        'reported_events': fields.List(fields.Nested(reported_event)),
        'comment': fields.String
    })

disease_report_model = api.model(
    'disease-report',
    {
        'url': fields.String,
        # TO DO: more look on the date format
        'date_of_publication': fields.DateTime,
        'headline': fields.String,
        'main_text': fields.String,
        'reports': fields.List(fields.Nested(report))
    })


#####################################################################################################


# default index page render to REST api doc
@app.route('/')
def index():
    return render_template("index.html", token=api.base_url + 'doc')

# default index page render to REST api doc
@app.route('/api/v1/doc-url')
def doc_url():
    return '{}doc'.format(api.base_url)


######################
##      CLOSED      ##
######################
# # locations
# GET /api/reports/locations
# -- Index locations
#   Response an array of locations
@api.route('/reports/locations/all')
class locations(Resource):

    @api.response(200, 'Data fetched successfully', location)
    @api.response(400, 'Bad request')
    @api.response(404, 'No data found')
    @api.doc(description="Get all the disease related locations that occured in all disease reports we have.")
    def get(self):
        collection = db[LOCATION]
        result = []

        for report_location in collection.find():
            e = {}
            e['country'] = report_location['country']
            e['state'] = report_location['state']
            e['city'] = report_location['city']
            result.append(e)

        return result, 200


######################
##      CLOSED      ##
######################
# GET /api/reports/locations/:area
# -- get a single location by name
#     Response a single location object:
#     {
#       county: string,
#       state: string,
#       city: string
#     }
@api.route('/reports/locations/<string:area>')
class locations_with_area(Resource):

    @api.response(200, 'Specific location info fetched successfully', location)
    @api.response(400, 'Bad request')
    @api.response(404, 'No data found')
    @api.doc(description="Get the location info with an given area name")
    @api.doc(params={
        'area': 'a place you want to find either country or state or city'
    })
    def get(self, area):
        collection = db[LOCATION]
        search_string = "\'" + area + "\'"
        cursor = collection.find({"$text": {"$search": search_string}}, {"_id": 0})
        result = []

        for entry in cursor:
            result.append(entry)

        if not result:
            return {
                'message':
                    'Sorry, there is no data matched, make sure you enter the whole words you want to search'
            }, 404

        return result, 200


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
    @api.param('category', 'Optional, find out A agent keywords')
    @api.doc(params={'term_type': 'Can ONLY be [general] or [specific]'})
    @api.doc(description="This endpoint will return all predefined key terms from our database \
		in case user doesn't know what to search.\
        \n * <b>terms-type</b>: the type of each key-terms and only two types <i>general</i> or <i>specific</i> are available.\
		\n\t\t - <i>general</i> is a wilder range keyword\
        \n\t\t - <i>specific</i> refers to a limited but detailed range. So the category can use to further filter this type of key-terms\
        \n * <b>category</b> each key-term can be either <i>none</i> or <i>A Agents</i>, additional category can create for extra data source fetching\
		\n both <i>general</i> and <i>specific</i> are case insensitive.")
    def get(self, term_type):
        term_type = term_type.lower()
        if term_type not in ['general', 'specific']:
            return {
                'message':
                    'make sure that term-type can only be general or specific'
            }, 400
        collection = db[KEY_TERMS]

        result = []
        my_query = {'type': re.compile(term_type, re.IGNORECASE)}
        query = request.args.get('category')

        if query is not None:
            if term_type == "specific":
                query = query.lower()
                my_query = {
                    'type': re.compile(term_type, re.IGNORECASE),
                    'category': re.compile(query, re.IGNORECASE)
                }
            else:
                return {
                    'message':
                        'category is under specific type, please enter again'
                }, 400
        cursor = collection.find(my_query, {"_id": 0})
        for entry in cursor:
            result.append(entry)

        if not result:
            return {'message': 'Sorry, there is no data matched'}, 404

        return result, 200


######################
##      CLOSED      ##
######################
# GET /api/reports/filter
# -- Fetch disease reports by start date, end date, location, key_terms
#    Response an array of disease reports
#    Query type
#    {
#       start-date: string,
#       end-date: string,
#       key-terms: string,
#       location: string
#    }
#    pagination -- this refers to the design from atlassian
#    reference: https://developer.atlassian.com/server/confluence/pagination-in-the-rest-api/
#       -start::integer  : start from the n-th report
#       -limit::integer  : limit to the number of responseed reports
@api.route('/reports/filter')
class disease_reports_with_filter(Resource):

    @api.response(200, 'Specific location info fetched successfully', disease_report_model)
    @api.response(400, 'Bad request')
    @api.response(404, 'Page found')
    @api.param('Limit', 'Limit to the number of responsed reports')
    @api.param('Start', 'Start from the n-th report')
    @api.param('Location', 'A location(city/country/state etc.) that user is interested in')
    @api.param('Key-terms', 'The key terms user want to search')
    @api.param('End-date', 'End date of period of interest, FORMAT: YYYY-MM-DDTHH:MM:SS')
    @api.param('Start-date', 'Start date of period of interest, FORMAT: YYYY-MM-DDTHH:MM:SS')
    @api.doc(description="This endpoint will return all the reports that satisfy user requirements. \
		 When all parameters are empty, the endpoint will return all reports existed within the database.\
		\n All the parameters are optional, please follow the parameter descriptions when you want to pass any input.\
		\n * <b>Start-date/End-date</b>: \
        \n\t\t - The period that user is interested in. <strong>Reports are available between 2017-2019</strong>.\
        \n\t\t - No 'xx' values are accepted in YYYY-MM-DD format, you must enter valid dates matching the time range of the existing reports.\
		\n\t\t - When Start-date is empty, it will be set to default date. The default Start-date is 2017-01-01T00:00:00.\
        \n\t\t - When End-date is empty, it will be set to current date time as default.\
		\n\t\t<i>Input Format: YYYY-MM-DDTHH:MM:SS</i>\
        \n\n * <b>Key-terms</b>: The keywords that user wants to search. This is case insensitive.\
		\n\t\t<i>Input Format: Keyword1,Keyword2,..</i>\
		\n\n * <b>Location</b>: A location that user is concerned about. This is case insensitive and it is whole word search.\
		\n\t\t<i>Input Format: Syndey</i>\
		\n\n * <b>Start</b>: the number of the report to start the query from. The default value is 1\
        \n\t\t<i>Input	Format: positive integer only.</i>\
        \n\n * <b>Limit</b>: the numbers of report to return. The default value is 100.\
		\n\t\t<i>Input	Format: positive integer only.</i>")
    def get(self):

        collection = db[REPORTS]
        location_dictionary = db[LOCATION]

        without_date = []
        result = []

        start_date = request.args.get('Start-date')
        end_date = request.args.get('End-date')
        key_terms = request.args.get('Key-terms')
        location = request.args.get('Location')

        start = request.args.get('Start')
        limit = request.args.get('Limit')

        # pagination
        if start is None:
            start = 1
        if limit is None:
            limit = 100

        try:
            start = int(start)-1
        except ValueError:
            return {'message': 'START must be positive an integer'}, 400
        try:
            limit = int(limit)
        except ValueError:
            return {'message': 'LIMIT must be positive an integer'}, 400

        if start < 0:
            return {'message': 'START must be positive an integer'}, 400
        if limit <= 0:
            return {'message': 'LIMIT must be positive an integer'}, 400

        # check date formate && order
        if start_date is None:
            start_date = '2017-01-01T00:00:00'
        if end_date is None:
            end_date = datetime.now().isoformat()
            format_search = re.search('^([^.]*)', end_date, re.IGNORECASE)
            if format_search:
                end_date = format_search.group(0)

        dates = {
            'START DATE': start_date.strip(),
            'END DATE': end_date.strip()
        }
        print(dates)
        date_format = re.compile(
            r'^(201[7-9])-((0[1-9]|1[012]))-((0[1-9]|[12][0-9]|3[01]))T([01]?[0-9]|2[0-3]|xx):([0-5][0-9]|xx):([0-5][0-9]|xx)$')
        # make sure the format is right(both dates)
        for k in list(dates.keys()):
            if not date_format.match(dates[k]):
                return {'message': '{} format is wrong, please try again'.format(k)}, 400
            else:
                date, time = dates[k].split('T')
                time = time.replace('x', '0')
                dates[k] = '{}T{}'.format(date, time)
        # make sure the order of date
        if not DT.is_before(dates['START DATE'], dates['END DATE']):
            return {'message': 'START DATE must be before END DATE'}, 400
            # check valid query && filter with key terms and location

        search_string = '\''
        if key_terms:
            key_terms = key_terms.strip()

            key_terms_list = re.compile(r' *, *').split(key_terms)
            for key in key_terms_list:
                search_string += '\"' + key + '\" '

        if location:
            location = location.strip()
            # make sure location is more than a whole world
            count = location_dictionary.count_documents({"$text": {"$search": location}})
            if count <= 0:
                return {'message': 'LOCATION name is invaild or no related reports in database, please enter a correct location name, or enter another location'}, 400
            search_string += '\"' + location + '\" '

        search_string = search_string.strip() + '\''

        if search_string == "''":
            cursor = collection.find({}, {"_id": 0}).skip(start).limit(limit)
        else:
            cursor = collection.find({"$text": {"$search": search_string}}, {"_id": 0}).skip(start).limit(limit)

        for entry in cursor:
            without_date.append(entry)

        # implement date filter
        # convert string to datetime
        for entry in without_date:
            # replace xx equal to start date element
            pub_date = DT.align_date(entry['date_of_publication'], dates['START DATE'])

            # compare date
            start_date_com = datetime.strptime(dates['START DATE'], '%Y-%m-%dT%H:%M:%S').isoformat()
            end_date_com = datetime.strptime(dates['END DATE'], '%Y-%m-%dT%H:%M:%S').isoformat()
            pub_date_com = datetime.strptime(pub_date, '%Y-%m-%dT%H:%M:%S').isoformat()

            if start_date_com <= pub_date_com and pub_date_com <= end_date_com:
                result.append(entry)

        return result, 200


#######################################################################################################
if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    logging.basicConfig(
        filename='Api_log.log',
        filemode='w',
        format='%(asctime)s - %(message)s',
        datefmt='%d-%b-%y %H:%M:%S',
        level=logging.INFO)
    logging.info('LET THE GAMES BEGIN! API STARTS')
    logging.info('==========================================')
    app.run(host='127.0.0.1', port=config.PORT, debug=True)


# [END gae_python37_app]
