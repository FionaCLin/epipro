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
from lib import *
# [START gae_python37_app]
from flask import Flask, Blueprint
# not sure if we need this in localhost
# from flask_cors import CORS
from flask import Flask, url_for, redirect
from flask_restplus import Resource, Api
from flask import request
from flask_restplus import fields
from flask_restplus import inputs
from flask_restplus import reqparse


# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__)
blueprint = Blueprint('api', __name__, url_prefix='/api')
api = Api(blueprint,
          doc='/doc/',
          version='1.0',
          default="EpiPro",  # Default namespace
          title="EpiPro REST API Documentation",  # Documentation Title
          description="This is a EpiPro App REST API.\r\n SENG3011 workshop project")  # Documentation Description

app.register_blueprint(blueprint)
# not sure if we need this localhost
# CORS(app)

indicator = api.model('indicator_id',{'indicator_id': fields.String})
query_model = api.model('q',{'q': fields.String})

parser = reqparse.RequestParser()

# default index page render to REST api doc
@app.route('/')
def index():
    return redirect(url_for('api.doc'))

# dummy routes definition to play with
@api.route('/reports', endpoint='')
@api.doc()
class Index(Resource):
    def get(self, id):
        return url_for('/api')


@api.route('/reports/<id>', endpoint='reports')
@api.doc(params={'id': 'An ID'})
class Reports(Resource):
    def get(self, id):
        return {}

    @api.doc(responses={403: 'Not Authorized'})
    def post(self, id):
        api.abort(403)

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]
