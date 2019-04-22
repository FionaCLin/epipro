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


##########################################################################################
##                          Test All Reports Fetching                                   ##
##########################################################################################
def test_fetch_all_reports():
    r = client.get('/api/v1/reports/filter')
    print(r.status_code)
    print(r.data.decode('utf-8'))
    reports = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 200
    assert json.dumps(reports[0]) == json.dumps(sample_disease_report[0])


def test_fetch_all_report_w_valid_limit():
    r = client.get('/api/v1/reports/filter?Limit=10')
    reports = json.loads(r.data.decode('utf-8'))
    assert json.dumps(reports[0]) == json.dumps(sample_disease_report[0])
    assert r.status_code == 200


def test_fetch_all_report_w_invalid_limit():
    r = client.get('/api/v1/reports/filter?Limit=gen')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    print(response)
    assert response['message'] == 'LIMIT must be positive an integer'


def test_fetch_all_report_w_valid_start_at1():
    r = client.get('/api/v1/reports/filter?Start=1&Limit=10')
    reports = json.loads(r.data.decode('utf-8'))
    assert json.dumps(reports[0]) == json.dumps(sample_disease_report[0])
    assert r.status_code == 200


def test_fetch_all_report_w_valid_start_at2():
    r = client.get('/api/v1/reports/filter?Start=5&Limit=10')
    reports = json.loads(r.data.decode('utf-8'))
    assert len(reports) == 0
    assert r.status_code == 200


def test_reports_filter_w_start_as_zero():
    r = client.get('/api/v1/reports/filter?Start=0')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'START must be positive an integer'

# start negative


def test_reports_filter_w_start_negative():
    r = client.get('/api/v1/reports/filter?Start=-1')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'START must be positive an integer'

# start fraction


def test_reports_filter_w_start_fraction():
    r = client.get('/api/v1/reports/filter?Start=1.5')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'START must be positive an integer'

# limit zero


def test_reports_filter_w_limit_as_zero():
    r = client.get('/api/v1/reports/filter?Limit=0')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'LIMIT must be positive an integer'

# limit negative


def test_reports_filter_w_limit_negative():
    r = client.get('/api/v1/reports/filter?Limit=-1')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'LIMIT must be positive an integer'

# limit fraction


def test_reports_filter_w_limit_fraction():
    r = client.get('/api/v1/reports/filter?Limit=1.5')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'LIMIT must be positive an integer'


# def test_fetch_all_report_w_invalid_start_at2():
#     r = client.get('/api/v1/reports/all?limit=10&start="2"')
#     response = json.loads(r.data.decode('utf-8'))
#     assert r.status_code == 400
#     assert response['message'] == 'The start and limit need to be integer'

if __name__ == "__main__":
    print('## test_fetch_all_reports')
    test_fetch_all_reports()
    print('## test_fetch_all_report_w_valid_limit')
    test_fetch_all_report_w_valid_limit()
    print('## test_fetch_all_report_w_valid_start_at1')
    test_fetch_all_report_w_valid_start_at1()
    print('## test_fetch_all_report_w_valid_start_at2')
    test_fetch_all_report_w_valid_start_at2()
    print('## test_fetch_all_report_w_invalid_limit')
    test_fetch_all_report_w_invalid_limit()
    print('## test_reports_filter_w_start_as_zero')
    test_reports_filter_w_start_as_zero()
    print('## test_reports_filter_w_start_negative')
    test_reports_filter_w_start_negative()
    print('## test_reports_filter_w_start_fraction')
    test_reports_filter_w_start_fraction()
    print('## test_reports_filter_w_limit_as_zero')
    test_reports_filter_w_limit_as_zero()
    print('## test_reports_filter_w_limit_negative')
    test_reports_filter_w_limit_negative()
    print('## test_reports_filter_w_limit_fraction')
    test_reports_filter_w_limit_fraction()
