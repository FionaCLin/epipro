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
##                      Test Filter Reports start/end dates                             ##
##########################################################################################

# start date format


def test_reports_filter_w_xx_in_start_date():
    requests = [
        '/api/v1/reports/filter?Start-date=xxxx-01-01T10%3A33%3A24',
        '/api/v1/reports/filter?Start-date=2019-xx-01T10%3A33%3A24',
        '/api/v1/reports/filter?Start-date=2019-01-xxT10%3A33%3A24',
        '/api/v1/reports/filter?Start-date=2019-01-00T10%3A33%3A24',
        '/api/v1/reports/filter?Start-date=2019-01-32T10%3A33%3A24',
        '/api/v1/reports/filter?Start-date=2019-00-01T10%3A33%3A24',
        '/api/v1/reports/filter?Start-date=2019-13-01T10%3A33%3A24',
        '/api/v1/reports/filter?Start-date=2016-01-01T10%3A33%3A24',
        '/api/v1/reports/filter?Start-date=2020-01-01T10%3A33%3A24'
    ]
    for request in requests:
        response = client.get(request)
        assert response.status_code == 400
        data = json.loads(response.data.decode('utf-8'))
        print(data)
        assert data['message'] == 'START DATE format is wrong, please try again'

# end date format


def test_reports_filter_w_xx_in_end_date():
    requests = [
        '/api/v1/reports/filter?End-date=xxxx-02-01T10%3A33%3A24',
        '/api/v1/reports/filter?End-date=2019-xx-01T10%3A33%3A24',
        '/api/v1/reports/filter?End-date=2019-02-xxT10%3A33%3A24',
        '/api/v1/reports/filter?End-date=2019-02-00T10%3A33%3A24',
        '/api/v1/reports/filter?End-date=2019-02-32T10%3A33%3A24',
        '/api/v1/reports/filter?End-date=2019-00-01T10%3A33%3A24',
        '/api/v1/reports/filter?End-date=2019-13-01T10%3A33%3A24',
        '/api/v1/reports/filter?End-date=2016-02-01T10%3A33%3A24',
        '/api/v1/reports/filter?End-date=2020-02-01T10%3A33%3A24'
    ]
    for request in requests:
        response = client.get(request)
        assert response.status_code == 400
        data = json.loads(response.data.decode('utf-8'))
        print(data)
        assert data['message'] == 'END DATE format is wrong, please try again'

# start before end


def test_reports_filter_w_time_order():
    r = client.get(
        '/api/v1/reports/filter?Start-date=2019-04-02T00%3A00%3A00&End-date=2018-03-02T00%3A00%3A00')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 400
    assert response['message'] == 'START DATE must be before END DATE'

# return correct reports in a time range


def test_reports_filter_w_correct_time_range():
    r = client.get(
        '/api/v1/reports/filter?Start-date=2018-04-02T00%3A00%3A00&End-date=2019-03-02T00%3A00%3A00')
    response = json.loads(r.data.decode('utf-8'))

    assert r.status_code == 200
    assert json.dumps(response[0]) == json.dumps(sample_disease_report[0])

# leading/ trailing whitespace
# start date


def test_reports_filter_w_ws_start_date():
    r = client.get('/api/v1/reports/filter?Start-date=%20%20%20%202018-01-01T05%3A00%3A00%20%20%20%20')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 200
    assert json.dumps(response[0]) == json.dumps(sample_disease_report[0])


def test_reports_filter_w_ws_end_date():
    r = client.get(
        '/api/v1/reports/filter?End-date=%20%20%20%202019-01-01T05%3A00%3A00%20%20%20%20')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 200
    assert json.dumps(response[0]) == json.dumps(sample_disease_report[0])


if __name__ == "__main__":

    print('##### test API /reports/filter date #####')

    print('## test_reports_filter_w_xx_in_start_date')
    test_reports_filter_w_xx_in_start_date()

    print('## test_reports_filter_w_xx_in_end_date')
    test_reports_filter_w_xx_in_end_date()

    print('## test_reports_filter_w_time_order')
    test_reports_filter_w_time_order()

    print('## test_reports_filter_w_correct_time_range')
    test_reports_filter_w_correct_time_range()

    print('## test_reports_filter_w_ws_start_date')
    test_reports_filter_w_ws_start_date()

    print('## test_reports_filter_w_ws_end_date')
    test_reports_filter_w_ws_end_date()

    print('########## all filter date tests paased!  ##########')
