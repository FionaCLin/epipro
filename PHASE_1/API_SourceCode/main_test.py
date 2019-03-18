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

sample_data = json.load(open(os.path.join(cwd,'../TestScripts/key-terms.json'),'r'))

print(sample_data, 'ok')
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
      print(e)
      assert e['name'] in sample_data['specific']
      assert e['category'] in ['a agent', 'none']
      assert e['type'] == 'specific'

def test_specific_w_category_key_terms():
    main.app.testing = True
    client = main.app.test_client()
    r = client.get('/api/v1/reports/key-terms/specific?category=none')#<-- Update the url
    assert r.status_code == 200
    terms = json.loads(r.data.decode('utf-8'))
    for e in terms:
      print(e)
      assert e['name'] in sample_data['specific']
      assert e['category'] in ['a agent', 'none']
      assert e['type'] == 'specific'


def test_general_key_terms():
  r = client.get('/api/v1/reports/key-terms/general')
  assert r.status_code == 200
  terms = json.loads(r.data.decode('utf-8'))
  for e in terms:
    print(e)
    assert e['name'] in sample_data['general']
    assert e['category'] == 'none'
    assert e['type'] =='general'

def  test_invalid_param():
  r = client.get('/api/v1/reports/key-terms/xxx')
  assert r.status_code == 400
  r = client.get('/api/v1/reports/key-terms/')
  assert r.status_code == 404
  r = client.get('/api/v1/reports/key-terms/specific?caterogy=ccc')#<<< is this a invalid category?? it did not handler properly
  assert r.status_code == 404
   

def test_key_terms():
  test_invalid_param()
  test_general_key_terms()
  test_specific_key_terms()
  test_specific_w_category_key_terms()


test_index()
test_key_terms()
