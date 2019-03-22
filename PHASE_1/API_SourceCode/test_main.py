#!  /usr/local/bin/python3


import json
import os
import sys
import main
cwd = os.getcwd()

sample_key_terms = json.load(
    open(os.path.join(cwd, '../TestScripts/sample_output/key-terms.json'), 'r'))
sample_locations = json.load(
    open(os.path.join(cwd, '../TestScripts/sample_output/locations.json'), 'r'))
sample_disease_report = json.load(open(os.path.join(
    cwd, '../TestScripts/sample_output/sample_disease_report.json'), 'r'))

main.app.testing = True
client = main.app.test_client()


def test_index():
    r = client.get('/')
    assert r.status_code == 200


def test_specific_key_terms():
    r = client.get('/api/v1/reports/key-terms/specific')
    assert r.status_code == 200
    terms = json.loads(r.data.decode('utf-8'))
    for e in terms:
        # print(e)
        assert e['name'] in sample_key_terms['specific']
        assert e['category'] in ['A Agents', 'none']
        assert e['type'] == 'specific'


def test_specific_w_category_A_agents_key_terms():
    r = client.get('/api/v1/reports/key-terms/specific?category=A%20Agents')
    assert r.status_code == 200
    terms = json.loads(r.data.decode('utf-8'))
    for e in terms:
        # print(e)
        assert e['name'] in sample_key_terms['specific']
        assert e['category'] == 'A Agents'
        assert e['type'] == 'specific'


def test_specific_w_category_none_key_terms():
    r = client.get('/api/v1/reports/key-terms/specific?category=none')
    assert r.status_code == 200
    terms = json.loads(r.data.decode('utf-8'))
    for e in terms:
        # print(e)
        assert e['name'] in sample_key_terms['specific']
        assert e['category'] == 'none'
        assert e['type'] == 'specific'


def test_general_key_terms():
    r = client.get('/api/v1/reports/key-terms/general')
    assert r.status_code == 200
    terms = json.loads(r.data.decode('utf-8'))
    for e in terms:
        # print(e)
        assert e['name'] in sample_key_terms['general']
        assert e['category'] == 'none'
        assert e['type'] == 'general'


def test_invalid_param():
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


def test_fetch_all_reports():
    r = client.get('/api/v1/reports/all')
    reports = json.loads(r.data.decode('utf-8'))
    assert json.dumps(reports()) == json.dumps(sample_disease_report)
    assert r.status_code == 200

# def test_filter_reports():
#   r = client.get('/api/v1/reports/filter')
#   assert r.status_code == 200


def test_fetch_all_locations():
    r = client.get('/api/v1/reports/locations/all')
    locations = json.loads(r.data.decode('utf-8'))

    for i in range(len(locations)-1):
        for e in locations[i].keys() & sample_locations[i].keys():
            # print(locations[i][e], sample_locations[i][e], e)
            assert locations[i][e] == sample_locations[i][e]
    assert r.status_code == 200


def test_get_location_by_area():
    r = client.get('/api/v1/reports/locations/Sydney')
    loc = json.loads(r.data.decode('utf-8'))
    assert loc[0]['country'] == 'Australia'
    assert loc[0]['state'] == 'New South Wales'
    assert loc[0]['city'] == 'Sydney'
    assert r.status_code == 200


def test_loc_invalid_param():
    r = client.get('/api/v1/reports/locations/syd')
    assert r.status_code == 404
    response = json.loads(r.data.decode('utf-8'))
    assert response['message'] == 'Sorry, there is no data matched, make sure you enter the whole words you want to search'


def test_locations():

    print('test fetch all locations')
    test_fetch_all_locations()
    print('test_get_location_by_area')
    test_get_location_by_area()
    print('test_invalid_param')
    test_loc_invalid_param()


test_index()
test_key_terms()
test_locations()
# test_fetch_all_reports()




# done locations and key terms
