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
##                           Test Filter Reports With key-terms                         ##
##########################################################################################

def test_reports_filter_w_giveb_keyterms():
    r = client.get('/api/v1/reports/filter?Key-terms=h7n9')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 200
    assert json.dumps(response[0]) == json.dumps(sample_disease_report[0])

def test_reports_filter_w_ws_keyterm():
    r = client.get(
        '/api/v1/reports/filter?Key-terms=%20h7n9%20%20%20%20%20%20%20%20%20%20%20')
    response = json.loads(r.data.decode('utf-8'))
    assert r.status_code == 200
    assert json.dumps(response[0]) == json.dumps(sample_disease_report[0])
   
if __name__ == "__main__":
   
    print('## test_reports_filter_w_giveb_keyterms')
    test_reports_filter_w_giveb_keyterms()
    print('## test_reports_filter_w_ws_keyterm')
    test_reports_filter_w_ws_keyterm()
    
    print('########## all filter keyterms tests paased!  ##########')

