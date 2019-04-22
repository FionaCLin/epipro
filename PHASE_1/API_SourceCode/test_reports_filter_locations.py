#!  /usr/local/bin/python3

import json
import os
import sys
import main

dir_path = os.path.dirname(os.path.realpath(__file__))

sample_disease_report = json.load(
    open(os.path.join(dir_path, '../TestScripts/sample_output/sample_disease_report.json'), 'r'))

main.app.testing = True
client = main.app.test_client()


def test_reports_filter_w_incomplete_location():
    r = client.get('/api/v1/reports/filter?Location=Sydn')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'LOCATION name is invaild or no related reports in database, please enter a correct location name, or enter another location'

# location not exist in DB


def test_reports_filter_w_nonexisted_location():

    r = client.get('/api/v1/reports/filter?Location=perth')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'LOCATION name is invaild or no related reports in database, please enter a correct location name, or enter another location'

# with complete location
# return correct reports with given location


def test_reports_filter_w_complete_location():
    r = client.get('/api/v1/reports/filter?Location=Sydney')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 200
    assert json.dumps(response[0]) == json.dumps(sample_disease_report[0])

# location


def test_reports_filter_w_ws_location():
    r = client.get(
        '/api/v1/reports/filter?Location=%20sydney%20%20%20%20%20%20%20%20%20%20%20')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 200
    assert json.dumps(response[0]) == json.dumps(sample_disease_report[0])


if __name__ == "__main__":
    print('##### test API /reports/filter location #####')

    print('## test_reports_filter_w_incomplete_location')
    test_reports_filter_w_incomplete_location()
    print('Passed test_reports_filter_w_incomplete_location')

    print('## test_reports_filter_w_nonexisted_location')
    test_reports_filter_w_nonexisted_location()
    print('Passed test_reports_filter_w_nonexisted_location')

    print('## test_reports_filter_w_complete_location')
    test_reports_filter_w_complete_location()
    print('Passed test_reports_filter_w_complete_location')

    print('########## all filter location tests paased!  ##########')
