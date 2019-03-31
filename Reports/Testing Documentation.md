[//]: # ( 3.1. API	Testing D2)
# API Testing

[//]: # ( • Describe	the	testing	processes	used	in	the	development	of API,	referring	to	the	data	and	scripts	included	in	Phase_1	folder.	This	should	describe	your testing	environment	and/or tools	used,	and	limitation e.g.	things	that	are	not	tested.	Describe	your testing	process	i.e.	how	your	team	conducts	testing using	the	test	data	e.g.	in	which	order	and	an overview	of	test	cases,	testing	data	and	testing	results.)
## Testing Processes in Development of API
### Configuration
We configured our setup by using the file `PHASE_1/API_SourceCode/config.py`, and we created template of this file at `PHASE_1/API_SourceCode/config.sample.py`. Since the `config.py` file contains our database credentials, we only committed the template of this file within the git repository. This `config.py` file sets up the connection string for the `PHASE_1/API_SourceCode/test_main.py` file, and it helps differentiate the db connection string based on the command line arguments. The bash testing script points the main.py connect towards the test database, and the flask run command points the main.py to use the development database.
### Test Processes and Test Environment
Since there are two major dependent components in this stage (see Unit Testing System Components Diagram), we built them separately and isolated them in their specific test environment. During the development, we applied a Test-Driven Development (TDD) to ensure the functionalities of each system components. We built the tests and developed the system components simultaneously. This allowed us to have greater development efficiency, and the built test helped other team members to understand the business logic and the functionalities of both the API and web scraper. Our functional Unit Testings are composed of both API Unit Testing and Scraper Unit Testing.
 
 ![Unit Testing System Components Diagram](testing-components.png "Unit Testing")

To trigger each or all the tests using the bash script `unit-test.sh` inside the `  ./PHASE_1/TestScripts/` folder, please refer to the example below:

  * test all
  ```bash
  ./PHASE_1/TestScripts/unit-test.sh
  ```
  The unit tests will test all the test cases with the following output. This contains all the test cases we have made so far, which will be updated for later development.
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
*********** test scraper ***********
## test scraper generated format
Passed test scraper generated format
## test scraper data extraction
Pass test scraper data extraction
Passed test_check_swap_date
 ```
 * only test on main.py
  ```bash
 ./PHASE_1/TestScripts/unit-test.sh main
  ```
  The test will show the follow output.
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

#### API tests
API Unit tests in the `PHASE_1/API_SourceCode/test_main.py` file tests each API endpoint comprehensively and extensively. That means not only the expected successful test cases are tested, but also the invalid input test cases. We collected the sample output based on the project specifications and the specification repository in GitHub, for the test's expected output in our sample test data files.  Additionally, the testing of our API endpoint response was compared against our expected sample output files. The sample disease report data is located at `PHASE_1/TestScripts/sample_output/sample_disease_report.json`, the key terms data can be found at `PHASE_1/TestScripts/sample_output/key-terms.json`, and the locations data is at `PHASE_1/TestScripts/sample_output/locations.json`. Since the API endpoints are exposed to the public and it receives any kinds of requests that may harm the backend server, this should ensure that the API requests won't accidentally cause any internal server error.

We also tested our date helper functions, where these tests is located in `PHASE_1/API_SourceCode/test_date.py`. Since the start date and end date has special requirements, it requires extra functions to process these date inputs. Those functionalities have been tested throughout.
For simplicity, we have left the pytest script `test_<main/date>.py` in `PHASE_1/API_SourceCode` and the unit-test running script `unit-test.sh` in `PHASE_1/TestScripts`. The pytest script imports `main.py`, in order to create the test application instance which will be tested with as the test_client.

#### Scraper tests
Scraper Unit Tests located in `PHASE_1/API_SourceCode/Test_scraper.py` help test the functionalities, as well as the correctness. For this purpose, we have utilised a few URLs of the articles from WHO as the test input. The corresponding sample disease reports data is created (according to the project specification) as the expected output for the purposes of testing and developing the web scaping. In this phase of development, the Scraper's correctness and functionalities are more vital to the project scope and definition. Thus, we followed the project requirements and pre-defined input from the project specifications as well as the expected sample output to ensure our web Scraper met the requirements.

#### CICD tests
CICD tests have been set up within GitHub and Travis, and `.travis.yaml` was developed to watch every push to git repository. Only the `production` branch will trigger the build and testing. After it passes the build testing, it is then deployed to the production site in Google Cloud Platform.

The CICD process consists of the setup of the virtual environment, installing and packing all the dependent modules into the `lib/` folder, runing all existing unit tests for our API and scraper, confirming that all the tests have passed, and then deploying the latest version of the application to the production site in Google Cloud Platform.

For more details, please refer to the section [Testing and CICD of Design Detail](https://github.com/unsw-se3011/SENG3011_EpiPro/blob/master/Reports/Design%20Details.md#testing-and-cicd)

### Test tools
Unit Testing was developed and run against each build. We used Pytest to develop the tests that are required for each function of our APIs and Scraper within our web server. The Pytest module can be easily accessed within the Flask built-in test framework. Although there are also other test frameworks like nose and unittest, we found that Pytest fully achieved our test purposes. Additionally, it also minimized the setup time and it was more compatable with Flask, since it was already built-in. This allowed us to easily create a test instance of our system and perform the tests on the different developing system components.

### Limitation and Exception 
Due to the time constraint of this project, there are a few things that were outside of our testing scope:
* API efficiency and performance

As a third party database is used for development, we excluded performance tests for data query from the database. Testing on a query from an external database was not part of our project scope. Also, the latency occurrence on the external data fetch was not part of our test scope. We are currently not as concerned about performance, since we are not performing this project on an industry level, and it is still being developed as a prototype.

* Scraper performance and efficiency and regression analysis

Since we are still in the development phase and everything has not been functioning properly as of yet, there is not much we can do in terms of testing the performance and efficiency, alongside regression testing. The testing results will get skew based, depending on the incorrectness of the web scraping and/or other factors. Testing web scraping is hard to do in general, since it cannot be fully done autonomously and requires the sample data to be created manually, after a preliminary inspection of what is needed to be web scraped.

## Test Driven Development
Since we followed the principle of test driven development (TDD), every test is developed for a specific system component and the tests covered both success and failure scenarios. Each test ensured any further code changes do not break other components. Hence, the we built the unit tests throughout the development process whilst making sure they were reliable. The tests' reliability allowed us to identify potential bugs and failure within individual system components, so we could identify and analyse the problem easily. Units also helped sort out some of the business logic and conquer a few of the edge cases.

We encountered multiple failed tests during this development phase. Whenever we received a failed test, we traced down the error step by step. During this process, we utilised our problem solving skills to understand the problem that was encountered, why it failed and what caused the failure. We then took action, according to the failure or reason.

For example, we followed a certain process when the fetched data did not match out expected output. We looked into the response and checked what was the error message e.g. a database authentication problem. According to this error, we then looked into the section related to that error, which in this case, should be from the database connection string. Usually, this type of error was caused by a misspelling and it was easily resolved by correcting it. However, sometimes it was caused by the inconsistent updates e.g. developer A changed a collection name in remote database, but forgot to change the code which queries that collection. In this situation, we traced down the corresponding query to match the code change. By using this TDD method, we were able to improve our test results so that all of our tests passed successfully on build. 


[//]: # ( • Describe	the	output	of	testing	and	what	actions	you	took to	improve	the	test results. At	D2	your	Phase_1/TestScripts	folder	should	contain:)
[//]: # (1. Test	input	files	)
[//]: # (2. Test	configuration	files	if	any)	
[//]: # (3. Result	files	if	any)
[//]: # (4. Software	or	scripts	used	during	testing	if	any)






















[//]: # (3.2. Platform Testing D4)
[//]: # (• Describe	the	testing	processes	used	in	the development of	the	platform.	You	may	include	a	sub-folder	in	Phase_2	folder	to	include	any	data,	scripts	you	used	to	test	the	platform. • Describe	the	output	of	testing	and	what	actions	you	took	to	improve	the	test results.)
