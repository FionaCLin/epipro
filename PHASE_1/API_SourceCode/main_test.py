# Copyright 2018 Google Inc. All Rights Reserved.
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

import main
import json,os
cwd = os.getcwd()

sample_key_terms = json.load(open(os.path.join(cwd,'../TestScripts/sample_data/key-terms.json'),'r'))
sample_locations = json.load(open(os.path.join(cwd,'../TestScripts/sample_data/locations.json'),'r'))
sample_disease_report = open(os.path.join(cwd,'../TestScripts/sample_data/sample_disease_report.json'),'r')

main.app.testing = True
client = main.app.test_client()
    
def test_index():
  r = client.get('/')
  assert r.status_code == 200

def test_specific_key_terms():
  main.app.testing = True
  client = main.app.test_client()
  r = client.get('/api/v1/reports/key-terms/specific')
  assert r.status_code == 200
  terms = json.loads(r.data.decode('utf-8'))
  for e in terms:
    # print(e)
    assert e['name'] in sample_key_terms['specific']
    assert e['category'] in ['A Agents', 'none']
    assert e['type'] == 'specific'

def test_specific_w_category_A_agents_key_terms():
  main.app.testing = True
  client = main.app.test_client()
  r = client.get('/api/v1/reports/key-terms/specific?category=A%20Agents')
  assert r.status_code == 200
  terms = json.loads(r.data.decode('utf-8'))
  for e in terms:
    # print(e)
    assert e['name'] in sample_key_terms['specific']
    assert e['category']  == 'A Agents'
    assert e['type'] == 'specific'

def test_specific_w_category_none_key_terms():
  main.app.testing = True
  client = main.app.test_client()
  r = client.get('/api/v1/reports/key-terms/specific?category=none')
  assert r.status_code == 200
  terms = json.loads(r.data.decode('utf-8'))
  for e in terms:
    # print(e)
    assert e['name'] in sample_key_terms['specific']
    assert e['category']  == 'none'
    assert e['type'] == 'specific'

def test_general_key_terms():
  r = client.get('/api/v1/reports/key-terms/general')
  assert r.status_code == 200
  terms = json.loads(r.data.decode('utf-8'))
  for e in terms:
    # print(e)
    assert e['name'] in sample_key_terms['general']
    assert e['category'] == 'none'
    assert e['type'] =='general'

def  test_invalid_param():
  r = client.get('/api/v1/reports/key-terms/xxx')
  assert r.status_code == 400
  r = client.get('/api/v1/reports/key-terms/')
  assert r.status_code == 404
  r = client.get('/api/v1/reports/key-terms/specific?category=ccc')
  response = json.loads(r.data.decode('utf-8'))
  assert r.status_code == 404
  assert response['message'] == 'Sorry, there is no data matched'
   

def test_key_terms():
  print('test_invalid_param')
  test_invalid_param()
  print('test_general_key_terms')
  test_general_key_terms()
  print('test_specific_key_terms')
  test_specific_key_terms()
  print('test_specific_w_category_none_key_terms')
  test_specific_w_category_none_key_terms()
  print('test_specific_w_category_A_agents_key_terms')
  test_specific_w_category_A_agents_key_terms()

def test_fetch_all_locations():
  r = client.get('/api/v1/reports/locations/all')
  locations = json.loads(r.data.decode('utf-8'))
  
  for i in range(len(locations)):
    for e in locations[i].keys() & sample_locations[i].keys():
      # print(locations[i][e], sample_locations[i][e])
      assert locations[i][e] == sample_locations[i][e]
  assert r.status_code == 200

def test_fetch_all_reports():
  r = client.get('/api/v1/reports/all')
  reports = json.loads(r.data.decode('utf-8')[:-1])
  assert reports == sample_disease_report
  assert r.status_code == 200

# def test_filter_reports():
#   r = client.get('/api/v1/reports/filter')
#   assert r.status_code == 200

# def test_locations():
#   test_fetch_all_locations()
#   test_get_location_by_id()

test_index()
test_key_terms()
# test_locations()
test_fetch_all_locations()
test_fetch_all_reports()
