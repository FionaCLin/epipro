#!  /usr/local/bin/python3

import json
import os
import sys
import main

dir_path = os.path.dirname(os.path.realpath(__file__))

sample_locations = json.load(
    open(os.path.join(dir_path, '../TestScripts/sample_output/locations.json'), 'r'))

main.app.testing = True
client = main.app.test_client()


##########################################################################################
##                                    Test Locations                                    ##
##########################################################################################


def test_fetch_all_locations():
    r = client.get('/api/v1/reports/locations/all')
    locations = json.loads(r.data.decode('utf-8'))
    for i in range(len(locations) - 1):
        for e in locations[i].keys() & sample_locations[i].keys():
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
    assert response[
        'message'] == 'Sorry, there is no data matched, make sure you enter the whole words you want to search'



   
if __name__ == "__main__":
    print('##### test API /reports/locations #####')
    print('## test fetch all locations')
    test_fetch_all_locations()
    print('Passed test fetch all locations')

    print('##### test API /reports/locations/{area} #####')
    print('## test_get_location_by_area')
    test_get_location_by_area()
    print('Passed test_get_location_by_area')
    
    print('## test_loc_invalid_param')
    test_loc_invalid_param()
    print('Passed test_loc_invalid_param')

