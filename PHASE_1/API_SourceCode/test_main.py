#!  /usr/local/bin/python3

import json
import os
import sys
import main

dir_path = os.path.dirname(os.path.realpath(__file__))

sample_key_terms = json.load(
	open(os.path.join(dir_path, '../TestScripts/sample_output/key-terms.json'), 'r'))
sample_locations = json.load(
	open(os.path.join(dir_path, '../TestScripts/sample_output/locations.json'), 'r'))
sample_disease_report = json.load(
	open(os.path.join(dir_path, '../TestScripts/sample_output/sample_disease_report.json'), 'r'))

main.app.testing = True
client = main.app.test_client()


def test_index():
	r = client.get('/')
	assert r.status_code == 200


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
	r = client.get('/api/v1/reports/key-terms/')
	assert r.status_code == 404
	r = client.get('/api/v1/reports/key-terms/specific?category=ccc')
	# response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 404


def test_key_terms():
	print('## test_invalid_param')
	test_invalid_param()
	print('## test_general_key_terms')
	test_general_key_terms()
	print('## test_specific_key_terms')
	test_specific_key_terms()
	print('## test_specific_w_category_none_key_terms')
	test_specific_w_category_none_key_terms()
	print('## test_specific_w_category_A_agents_key_terms')
	test_specific_w_category_A_agents_key_terms()

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


def test_locations():
	print('## test fetch all locations')
	test_fetch_all_locations()
	print('## test_get_location_by_area')
	test_get_location_by_area()
	print('## test_loc_invalid_param')
	test_loc_invalid_param()

##########################################################################################
##                          Test All Reports Fetching                                   ##
##########################################################################################


def test_fetch_all_reports():
	r = client.get('/api/v1/reports/all')
	reports = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 200
	assert json.dumps(reports[0]) == json.dumps(sample_disease_report)


def test_fetch_all_report_w_valid_limit():
	r = client.get('/api/v1/reports/all?limit=10')
	reports = json.loads(r.data.decode('utf-8'))
	assert json.dumps(reports[0]) == json.dumps(sample_disease_report)
	assert r.status_code == 200


def test_fetch_all_report_w_invalid_limit():
	r = client.get('/api/v1/reports/all?limit=gen')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 400
	assert response['message'] == 'The start and limit need to be integer'


def test_fetch_all_report_w_valid_start_at1():
	r = client.get('/api/v1/reports/all?limit=10&start=1')
	reports = json.loads(r.data.decode('utf-8'))
	assert json.dumps(reports[0]) == json.dumps(sample_disease_report)
	assert r.status_code == 200


def test_fetch_all_report_w_valid_start_at2():
	r = client.get('/api/v1/reports/all?limit=10&start=2')
	reports = json.loads(r.data.decode('utf-8'))
	assert len(reports) == 0
	assert r.status_code == 200


def test_fetch_all_report_w_invalid_start_at2():
	r = client.get('/api/v1/reports/all?limit=10&start="2"')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 400
	assert response['message'] == 'The start and limit need to be integer'


def test_all_reports():
	print('## test_fetch_all_reports')
	test_fetch_all_reports()
	print('## test_fetch_all_report_w_valid_limit')
	test_fetch_all_report_w_valid_limit()
	# print('## test_fetch_all_report_w_valid_start_at1')
	# test_fetch_all_report_w_valid_start_at1()
	print('## test_fetch_all_report_w_valid_start_at2')
	test_fetch_all_report_w_valid_start_at2()
	# print('## test_fetch_all_report_w_invalid_limit')
	# test_fetch_all_report_w_invalid_limit()
	# print('## test_fetch_all_report_w_invalid_start_at2')
	# test_fetch_all_report_w_invalid_start_at2()


##########################################################################################
##                              Test Filter Reports                                     ##
##########################################################################################

# def test_filter_reports():
#   r = client.get('/api/v1/reports/filter')
#   assert r.status_code == 200

# start date format
def test_reports_filter_w_xx_in_start_date():
	r1 = client.get('/api/v1/reports/filter?Start-date=xxxx-01-01T10%3A33%3A24')
	r2 = client.get('/api/v1/reports/filter?Start-date=2019-xx-01T10%3A33%3A24')
	r3 = client.get('/api/v1/reports/filter?Start-date=2019-01-xxT10%3A33%3A24')
	r4 = client.get('/api/v1/reports/filter?Start-date=2019-01-01Txx%3A33%3A24')
	r5 = client.get('/api/v1/reports/filter?Start-date=2019-01-01T10%3Axx%3A24')
	r6 = client.get('/api/v1/reports/filter?Start-date=2019-01-01T10%3A33%3Axx')

	response1 = json.loads(r1.data.decode('utf-8'))
	response2 = json.loads(r2.data.decode('utf-8'))
	response3 = json.loads(r3.data.decode('utf-8'))
	response4 = json.loads(r4.data.decode('utf-8'))
	response5 = json.loads(r5.data.decode('utf-8'))
	response6 = json.loads(r6.data.decode('utf-8'))

	assert r1.status_code == 400
	assert r2.status_code == 400
	assert r3.status_code == 400
	assert r4.status_code == 400
	assert r5.status_code == 400
	assert r6.status_code == 400

	assert response1['message'] == 'START DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response2['message'] == 'START DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response3['message'] == 'START DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response4['message'] == 'START DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response5['message'] == 'START DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response6['message'] == 'START DATE format is wrong, please try again, no \'xx\' is accepted'

# end date format
def test_reports_filter_w_xx_in_end_date():
	r1 = client.get('/api/v1/reports/filter?End-date=xxxx-02-01T10%3A33%3A24')
	r2 = client.get('/api/v1/reports/filter?End-date=2019-xx-01T10%3A33%3A24')
	r3 = client.get('/api/v1/reports/filter?End-date=2019-02-xxT10%3A33%3A24')
	r4 = client.get('/api/v1/reports/filter?End-date=2019-02-01Txx%3A33%3A24')
	r5 = client.get('/api/v1/reports/filter?End-date=2019-02-01T10%3Axx%3A24')
	r6 = client.get('/api/v1/reports/filter?End-date=2019-02-01T10%3A33%3Axx')

	response1 = json.loads(r1.data.decode('utf-8'))
	response2 = json.loads(r2.data.decode('utf-8'))
	response3 = json.loads(r3.data.decode('utf-8'))
	response4 = json.loads(r4.data.decode('utf-8'))
	response5 = json.loads(r5.data.decode('utf-8'))
	response6 = json.loads(r6.data.decode('utf-8'))

	assert r1.status_code == 400
	assert r2.status_code == 400
	assert r3.status_code == 400
	assert r4.status_code == 400
	assert r5.status_code == 400
	assert r6.status_code == 400

	assert response1['message'] == 'END DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response2['message'] == 'END DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response3['message'] == 'END DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response4['message'] == 'END DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response5['message'] == 'END DATE format is wrong, please try again, no \'xx\' is accepted'
	assert response6['message'] == 'END DATE format is wrong, please try again, no \'xx\' is accepted'

# start before end
def test_reports_filter_w_time_order():
	r = client.get('/api/v1/reports/filter?Start-date=2019-04-02T00%3A00%3A00&End-date=2015-03-02T00%3A00%3A00')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 400
	assert response['message'] == 'START DATE must be before END DATE'

# return correct reports in a time range
def test_reports_filter_w_correct_time_range():
	r = client.get('/api/v1/reports/filter?Start-date=2018-04-02T00%3A00%3A00&End-date=2019-03-02T00%3A00%3A00')
	response = json.loads(r.data.decode('utf-8'))

	assert r.status_code == 200
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

# return correct reports with given keyterms
def test_reports_filter_w_giveb_keyterms():
	
	r = client.get('/api/v1/reports/filter?Key-terms=h7n9')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 200
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

# incomplete location 
def test_reports_filter_w_incomplete_location():
	r = client.get('/api/v1/reports/filter?Location=Sydne')
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
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

# start zero
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

# leading/ trailing whitespace 
# start date
def test_reports_filter_w_ws_start_date():
	r = client.get('/api/v1/reports/filter?Start-date=%20%20%20%202018-01-01T05%3A00%3A00%20%20%20%20')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 200
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

# end date
def test_reports_filter_w_ws_end_date():
	r = client.get('/api/v1/reports/filter?End-date=%20%20%20%202019-01-01T05%3A00%3A00%20%20%20%20')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 200
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

# keyterm
def test_reports_filter_w_ws_keyterm():
	r = client.get('/api/v1/reports/filter?Key-terms=%20h7n9%20%20%20%20%20%20%20%20%20%20%20')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 200
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

#location
def test_reports_filter_w_ws_location():
	r = client.get('/api/v1/reports/filter?Location=%20sydney%20%20%20%20%20%20%20%20%20%20%20')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 200
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

# start
def test_reports_filter_w_ws_start():
	r = client.get('/api/v1/reports/filter?Start=%20%20%20%20%20%201%20%20')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 200
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

# limit
def test_reports_filter_w_ws_limit():
	r = client.get('/api/v1/reports/filter?Limit=%20%20%20%20%20%2010%20%20')
	response = json.loads(r.data.decode('utf-8'))
	assert r.status_code == 200
	assert json.dumps(response[0]) == json.dumps(sample_disease_report)

def test_reports_filter():
	print('##### test API /reports/filter #####')
	print('## test_reports_filter_w_xx_in_start_date')
	test_reports_filter_w_xx_in_start_date()
	print('## test_reports_filter_w_xx_in_end_date')
	test_reports_filter_w_xx_in_end_date()
	print('## test_reports_filter_w_time_order')
	test_reports_filter_w_time_order()
	print('## test_reports_filter_w_correct_time_range')
	test_reports_filter_w_correct_time_range()
	print('## test_reports_filter_w_giveb_keyterms')
	test_reports_filter_w_giveb_keyterms()
	print('## test_reports_filter_w_incomplete_location')
	test_reports_filter_w_incomplete_location()
	print('## test_reports_filter_w_nonexisted_location')
	test_reports_filter_w_nonexisted_location()
	print('## test_reports_filter_w_complete_location')
	test_reports_filter_w_complete_location()
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
	print('## test_reports_filter_w_ws_start_date')
	test_reports_filter_w_ws_start_date()
	print('## test_reports_filter_w_ws_end_date')
	test_reports_filter_w_ws_end_date()
	print('## test_reports_filter_w_ws_keyterm')
	test_reports_filter_w_ws_keyterm()
	print('## test_reports_filter_w_ws_location')
	test_reports_filter_w_ws_location()
	print('## test_reports_filter_w_ws_start')
	test_reports_filter_w_ws_start()
	print('## test_reports_filter_w_ws_limit')
	test_reports_filter_w_ws_limit()

	print('########## all filter tests paased!  ##########')

if __name__ == "__main__":
	test_index()
	test_key_terms()
	test_locations()
	test_reports_filter()
# done locations and key terms
