# Copyright 2015, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License"); you may not use
# this file except in compliance with the License. You may obtain a copy of the
# License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable
# law or agreed to in writing, software distributed under the License is distributed
# on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
# or implied. See the License for the specific language governing permissions and
# limitations under the License.
#! /anaconda3/bin/python3

import urllib.request as request
import logging
import json as json
import sys

HOST='https://beta-do1t-epiproapp.appspot.com'

# [START e2e]
response = request.urlopen("{}/api/v1/swagger.json".format(HOST))
json_res = json.loads(response.read().decode('utf-8'))
assert(json_res['swagger'] == "2.0")
assert(json_res['basePath'] == "/api/v1")
# [END e2e]


