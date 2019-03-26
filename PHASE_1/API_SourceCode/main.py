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
from lib import *
# [START gae_python37_app]

from flask import Flask, Blueprint
from flask_cors import CORS
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
import re
from datetime import datetime
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

#####  RESPONSE for /api/reports/key_terms
#      {id, type, category and name}
key_term = api.model(
	'key_term', 
	{
		'keyTerm_id': fields.Integer,
		'type': fields.String(enum=['general', 'specific']),
		'category': fields.String,
		'name': fields.String
	})

#####  RESPONSE for /api/reports
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
		# TO DO : figure out the range
		'type': fields.String,
		# TO DO: choose the right format
		'date': fields.DateTime,
		'location': fields.Nested(location_detail),
		'number-affected': fields.Integer
	})

report = api.model(
	'report',
	{
		'disease': fields.String,
		# TO DO: figure out field with a range
		'syndrome': fields.String,
		'reported_events': fields.List(fields.Nested(reported_event))
	})

disease_report_model = api.model(
	'disease-report',
	{
		'url': fields.String,
		# TO DO: more look on the date format
		'date_of_publiction': fields.DateTime,
		'headline': fields.String,
		'main_text': fields.String,
		'reports': fields.List(fields.Nested(report))
	})

filter_fields = api.model(
	'filter',
	{
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
	return render_template("index.html", token=api.base_url + 'doc')


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
	# TO DO: specify the reason
	@api.response(400, 'Bad request')
	@api.response(404, 'No data found')
	@api.doc(description="Get all the disease related locations")
	def get(self):
		collection = db['test_location']
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
# -- get a single location by id
#     Response a single location object:
#     {
#       county: string,
#       state: string,
#       city: string
#     }
@api.route('/reports/locations/<string:area>')
class locations_id(Resource):

	#TO DO: partially matching??? no
	@api.response(200, 'Specific location info fetched successfully', location)
	@api.response(400, 'Bad request')
	@api.response(404, 'No data found')
	@api.doc(description="Get the location info with an given area name")
	@api.doc(params={
		'area': 'a place you want to find either country or state or city'
	})
	def get(self, area):
		collection = db['test_location']
		search_string = "\'" + area + "\'"
		cursor = collection.find({"$text": {
			"$search": search_string
		}}, {"_id": 0})
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
	@api.doc(description="Get all the key terms if no additional query,\
				otherwise, get all keys from [general] or [specific] type")
	# @api.expect([key_term], validate=True)
	def get(self, term_type):
		term_type = term_type.lower()
		if term_type not in ['general', 'specific']:
			return {
				'message':
				'make sure that term-type can only be general or specific'
			}, 400
		collection = db['Key_Terms']

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

		cursor = collection.find(my_query)
		for entry in cursor:
			e = {}
			e['type'] = entry['type']
			e['category'] = entry['category']
			e['name'] = entry['name']
			result.append(e)
		if not result:
			return {'message': 'Sorry, there is no data matched'}, 404
		return result, 200


######################
##      CLOSED      ##
######################
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

	@api.response(200, 'Specific location info fetched successfully', disease_report_model)
	# TO DO: specify the reason
	@api.response(400, 'Bad request')
	@api.response(404, 'No data found')
	# TO DO：start and limit should be filled at the same time
	@api.param('start','Optional Query, start from the n-th report')
	@api.param('limit','Optional Query, limit to the number of responseed reports')
	@api.doc(description="Get all disease reports")
	def get(self):
		collection = db['test_report']
		start = request.args.get('start')
		limit = request.args.get('limit')

		if start is None:
			start = 0
		if limit is None:
			limit = 100
		start = int(start)
		limit = int(limit)
		cursor = collection.find({},{ "_id": 0 }).skip(start).limit(limit)
		result = []

		for entry in cursor:
			result.append(entry)

		return result, 200


######################
##    IN PROGRESS   ##
######################
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
@api.route('/reports/filter')
class disease_report_with_filter(Resource):

	@api.response(200, 'Specific location info fetched successfully', disease_report_model)
	# TO DO: specify the reason
	@api.response(400, 'Bad request')
	@api.response(404, 'No data found')
	@api.param('Start-date','Start date of period of interest, FORMAT: YYYY-MM-DDTHH:MM:SS')
	@api.param('End-date','End date of period of interest, FORMAT: YYYY-MM-DDTHH:MM:SS')
	@api.param('Key-terms','The key terms user want to search')
	@api.param('Location','Input a location name (city/country/state etc.)')
	@api.doc(description="Get all reports according to the filter")
	def get(self):

		collection = db['test_report']
		location_dictionary = db['test_location']

		result = []

		start = request.args.get('Start-date')
		end = request.args.get('End-date')
		key_terms = request.args.get('Key-terms')
		location = request.args.get('Location')

		if start is None:
			start = '2019-01-01T00:00:00'
		if end is None:
			end = datetime.now().isoformat()
			format_search = re.search('^([^.]*)', end, re.IGNORECASE)
			if format_search:
				end = format_search.group(0)

		date_format = re.compile(r'^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)')
		#make sure the format is right(both dates)
		if not date_format.match(start):
			return { 'message': 'The START date format is wrong, please try again' }, 404
		if not date_format.match(end):
			return { 'message': 'The END date format is wrong, please try again' }, 404
		#make sure the order of date
		if not DT.is_before(start, end):
			return { 'message': 'START date must be before END date' }, 404

		#check valid query && filter with key terms and location
		search_string = '\''
		if key_terms:
			key_terms_list = re.compile(r' *, *').split(key_terms)
			for key in key_terms_list:
				search_string += '\"' + key + '\" '

		if location:
			#make sure location is more than a whole world
			count = location_dictionary.count_documents({"$text": {"$search": location}})
			if count <= 0:
				return { 'message': 'LOCATION name is invaild, please enter a correct location name' }, 404
			search_string += '\"' + location + '\" '

		search_string = search_string.strip() + '\''
		print(search_string)

		cursor = collection.find({"$text": {"$search": search_string}}, { "_id": 0 })

		for entry in cursor:
			result.append(entry)
		
		#implement date filter

		return result, 200


#######################################################################################################

if __name__ == '__main__':
	# This is used when running locally only. When deploying to Google App
	# Engine, a webserver process such as Gunicorn will serve the app. This
	# can be configured by adding an `entrypoint` to app.yaml.
	app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
