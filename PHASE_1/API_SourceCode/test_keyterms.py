#!  /usr/local/bin/python3

import json
import os
import sys
import main

dir_path = os.path.dirname(os.path.realpath(__file__))

sample_key_terms = json.load(
    open(os.path.join(dir_path, '../TestScripts/sample_output/key-terms.json'), 'r'))

main.app.testing = True
client = main.app.test_client()


##########################################################################################
##                                    Test Key Terms                                    ##
##########################################################################################
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
    r = client.get('/api/v1/reports/key-terms/0')
    assert r.status_code == 400
    r = client.get('/api/v1/reports/key-terms/specific?category=ccc')
    assert r.status_code == 404


if __name__ == "__main__":
    print('##### test API /reports/key-terms #####')
    print('## test_invalid_param')
    test_invalid_param()
    print('Passed test_invalid_param')
    print('## test_general_key_terms')
    test_general_key_terms()
    print('Passed test_general_key_terms')
    print('## test_specific_key_terms')
    test_specific_key_terms()
    print('Passed test_specific_key_terms')
    print('## test_specific_w_category_none_key_terms')
    test_specific_w_category_none_key_terms()
    print('Passed test_specific_w_category_none_key_terms')
    print('## test_specific_w_category_A_agents_key_terms')
    test_specific_w_category_A_agents_key_terms()
    print('Passed test_specific_w_category_A_agents_key_terms')
