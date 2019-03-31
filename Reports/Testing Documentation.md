[//]: # ( 3.1. API	Testing D2)
# API Testing

[//]: # ( • Describe	the	testing	processes	used	in	the	development	of API,	referring	to	the	data	and	scripts	included	in	Phase_1	folder.	This	should	describe	your testing	environment	and/or tools	used,	and	limitation e.g.	things	that	are	not	tested.	Describe	your testing	process	i.e.	how	your	team	conducts	testing using	the	test	data	e.g.	in	which	order	and	an overview	of	test	cases,	testing	data	and	testing	results.)
## Testing Processes in Development of API
### Configuration
We configured our setup by using the file located and named `PHASE_1/API_SourceCode/config.py`. This template of that file is located at `PHASE_1/API_SourceCode/config.sample.py`. Because `config.py` file contains our database credential. We only commit the template of that file in git repository. This `config.py` file sets up the connection string for the `PHASE_1/API_SourceCode/test_main.py` file, and it helps differentiate the db connection string based on the command line arguments. The bash testing script will point the main.py connect towards the test database, and the flask run command will point the main.pyto use the development database.
### Test Processes and Test Environment
Because there are two major dependent components in this stage（see Unit Testing System Components Diagram）, we have to build them separately and isolate them in their specific test environment. During the development, we will apply Test-Driven Development(TDD) to ensure the functionalities of each system components. We will build the test and develop the system component simultaneously. This allows us to have the fast development also the built test can help other team members to understanding the business logic and the functionalities of API and web scraper, as well as the code coverage. Our functional Unit Testings will be composed of API Unit Testing and Scraper Unit Testing.
 
 ![Unit Testing System Components Diagram](testing-components.png "Unit Testing")

#### API tests
API Unit tests in `PHASE_1/API_SourceCode/test_main.py` file will test each API endpoint comprehensively and extensively. That means not only the expected successful test cases will be tested, but also the invalid input test cases. We will collect the sample output based on the project specifications and the specification repository in GitHub for the test's expected output into our sample test data files.  Additionally, the testing of our API endpoint response will be compared against our expected sample output files. Sample disease report data will be located in `PHASE_1/TestScripts/sample_output/sample_disease_report.json` and the key terms data can be found in `PHASE_1/TestScripts/sample_output/key-terms.json`, as well as the locations data in `PHASE_1/TestScripts/sample_output/locations.json`. Since those API endpoints are exposed to the public and it will receive any kinds of requests that may harm the backend server, this should ensure that the API requests won't accidentally cause any internal server error.

We will also test our date helper functions, where these tests will be located in `PHASE_1/API_SourceCode/test_date.py`. Because the start date and end date has special requirements, it would require some extra functions to process these date inputs. Those functionalities have been tested throughout.
For simplicity, we have left the pytest script `test_<main/date>.py` in `PHASE_1/API_SourceCode` and the unit-test running script `unit-test.sh` in `PHASE_1/TestScripts`. The pytest script will import `main.py`, in order to create the test application instance which will be tested with as the test_client.
To use `unit-test.sh`, please refer to the below example:
  * test all
  ```bash
  ./PHASE_1/TestScripts/unit-test.sh
  ```
  The tests will show below output. This contains all the test cases we have made so far.
  ```
~/Documents/SENG3011_EpiPro
************ test main ************
## test_invalid_param
Passed test_invalid_param
## test_general_key_terms
Passed test_general_key_terms
## test_specific_key_terms
Passed test_specific_key_terms
## test_specific_w_category_none_key_terms
Passed test_specific_w_category_none_key_terms
## test_specific_w_category_A_agents_key_terms
Passed test_specific_w_category_A_agents_key_terms
## test fetch all locations
Passed test fetch all locations
## test_get_location_by_area
Passed test_get_location_by_area
## test_loc_invalid_param
Passed test_loc_invalid_param
## test_fetch_all_reports
Passed test_fetch_all_reports
## test_fetch_all_report_w_valid_limit
Passed test_fetch_all_report_w_valid_limit
## test_fetch_all_report_w_valid_start_at1
Passed test_fetch_all_report_w_valid_start_at1
## test_fetch_all_report_w_valid_start_at2
Passed test_fetch_all_report_w_valid_start_at2
## test_fetch_all_report_w_invalid_limit
Passed test_fetch_all_report_w_invalid_limit
## test_fetch_all_report_w_invalid_start_at2
Passed test_fetch_all_report_w_invalid_start_at2
************ test date ************
## test_check_date
Passed test_check_date
## test_check_is_before
Passed test_check_is_before
test_check_swap_date
Passed test_check_swap_date
 ```
 * only test on main.py
  ```bash
 ./PHASE_1/TestScripts/unit-test.sh main
  ```
  The test will show below output
  ```
~/Documents/SENG3011_EpiPro
************ test main ************
## test_invalid_param
Passed test_invalid_param
## test_general_key_terms
Passed test_general_key_terms
## test_specific_key_terms
Passed test_specific_key_terms
## test_specific_w_category_none_key_terms
Passed test_specific_w_category_none_key_terms
## test_specific_w_category_A_agents_key_terms
Passed test_specific_w_category_A_agents_key_terms
## test fetch all locations
Passed test fetch all locations
## test_get_location_by_area
Passed test_get_location_by_area
## test_loc_invalid_param
Passed test_loc_invalid_param
## test_fetch_all_reports
Passed test_fetch_all_reports
## test_fetch_all_report_w_valid_limit
Passed test_fetch_all_report_w_valid_limit
## test_fetch_all_report_w_valid_start_at1
Passed test_fetch_all_report_w_valid_start_at1
## test_fetch_all_report_w_valid_start_at2
Passed test_fetch_all_report_w_valid_start_at2
## test_fetch_all_report_w_invalid_limit
Passed test_fetch_all_report_w_invalid_limit
## test_fetch_all_report_w_invalid_start_at2
Passed test_fetch_all_report_w_invalid_start_at2
  ```

#### Scraper tests
Scraper Unit Tests will help test the functionalities as well as the correctness. For this purpose, we have utilised the url of the article as the test input and the sample disease report data (sample_disease_report.json) from the project specification as the expected output, in testing and developing the web scaping. In this phase of development, the Scraper's correctness and functionalities are more vital to the project scope and definition. Thus, we followed the project requirements and pre-defined input in project specifications as well as the expected sample output to ensure our web Scraper met the requirements.

#### CICD tests
CICD tests have been set up within GitHub and Travis, and `.travis.yaml` was developed to watch every push to git repository. Only the `production` branch will trigger the build and testing and then deploy to the production site in Google Cloud Platform after passed build testing.

The CICD process will consist of setup a virtual environment, install and pack all dependent modules into `lib/` folder, run all existing unit tests for our API and scraper as well as deploy the latest version of application to the production site in Google Cloud Platform after passed all the tests.

More detail please refer to the section [Testing and CICD of Design Detail](https://github.com/unsw-se3011/SENG3011_EpiPro/blob/master/Reports/Design%20Details.md#testing-and-cicd)

### Test tools
Unit Testing will be developed and run against each build. Those tests are required for each function of our APIs and Scraper within our web server, which will be developed with Pytest. The Pytest module can be easily accesed within the Flask built-in test framework. Although there are also other test frameworks like nose, unittest. After researching on those, we find the built-in test not only can achieve our test purposes also it saved the time to setup as well as it is more compatable with Flask as it is the built-in test. This will allow us to bring up a test instance of our system and perform the tests on the different developing system components.

### Limitation and Exception 
Due to the time constraint of this project, there are a few things that are outside of our testing scope:
* API efficiency and performance

As a third party database is used for development, we excluded performance tests for data query from the database. Testing on a query from an external database is not part of our project scope. Also, the latency occurrence on the external data fetch is not part of our test scope. We are currently not as concerned about performance, since we are not performing this project on an industry level, and it is still being developed as a prototype.

* Scraper performance and efficiency and regression analysis

Since we are still in the development phase and everything has not been functioning properly as of yet, there is not much we can do in terms of testing the performance and efficiency, alongside regression testing. Those testing results will get skew based on the incorrectness of the web scraping and/or other factors. Testing web scraping is also hard to do, since it cannot be fully done automatously and requires the sample data to be created manually, after a preliminary inspection of what is needed to be web scraped.


[//]: # ( • Describe	the	output	of	testing	and	what	actions	you	took to	improve	the	test results. At	D2	your	Phase_1/TestScripts	folder	should	contain:)
[//]: # (1. Test	input	files	)
[//]: # (2. Test	configuration	files	if	any)	
[//]: # (3. Result	files	if	any)
[//]: # (4. Software	or	scripts	used	during	testing	if	any)






















[//]: # (3.2. Platform Testing D4)
[//]: # (• Describe	the	testing	processes	used	in	the development of	the	platform.	You	may	include	a	sub-folder	in	Phase_2	folder	to	include	any	data,	scripts	you	used	to	test	the	platform. • Describe	the	output	of	testing	and	what	actions	you	took	to	improve	the	test results.)
