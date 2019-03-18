[//]: # ( 3.1. API	Testing D2)
# API Testing

[//]: # ( • Describe	the	testing	processes	used	in	the	development	of API,	referring	to	the	data	and	scripts	included	in	Phase_1	folder.	This	should	describe	your testing	environment	and/or tools	used,	and	limitation e.g.	things	that	are	not	tested.	Describe	your testing	process	i.e.	how	your	team	conducts	testing using	the	test	data	e.g.	in	which	order	and	an overview	of	test	cases,	testing	data	and	testing	results.)
## Testing Processes in Development of API
### Test Processes and Test Environment
During the development, we are going to apply Test-Driven Development(TDD) to ensure the functionalities of each system components. 
Because there are two major components in this stage（see Unit Testing System Components Diagram）, our functional Unit Testings are composed of API Unit Testing and Scapper Unit Testing.
 ![Unit Testing System Components Diagram](testing-components.png "Unit Testing")
API Unit tests will test each API end point comprehensively and extensively, that means not only the expected successful test cases, but also the invalid input test cases. We collect the sample output for the test cases in to our sample test data files. And testing the API end point response against to our sample output files. Sample disease report data and the key terms data(key-terms.json) can be found in the folder(./PHASE_1/TestScripts/sample_data). Since those API end point are exposed to the public world and it will receive any kind of requests that will harm the backend server. Therefore, it should ensure the API request won't cause any internal server error.

Scapper Unit Tests will test the functionalities as well as the correctness. Utilising the url of the article as test input and the sample disease report data(sample_disease_report.json) from the project specification as the expected output in testing the developed the web scaping. In this phase of development, scapper correctness and functionalities are more vital to the project scope and definition. Thus, we follow the project requirements and pre-define input in project specification as well as the expect sample output to ensure our web scapper meet the requirements.

### Test tools
 Unit Testing will be developed and run against each build. Those tests are required for each functions of APIs and scraper within our web server, and will be developed with Pytest. Since Pytest is the Flask built-in test framework. It will help us to bring up a test instance of our system and do the tests on different developing system components.

### Limitation and Exception 
 Since the time constraint of the project, there are few things out of our test scope as follows:
 * API efficiency and performance

 As third party database is used for development, we exclude performance test for data query from the database. Also testing on query from database is not as part of the project scope. As well as the latency occur on external data fetch is not part of our test scope.
 * Scapper performance and efficiency and regression analysis
 
 Since we are still in the development phase and everything has not been functioning properly, there are not much meaning for testing the performance and efficienvy as well as the regression testing. Those testing results will get skew based on the incorrectness of the web scaping and/or other factors.


[//]: # ( • Describe	the	output	of	testing	and	what	actions	you	took to	improve	the	test results. At	D2	your	Phase_1/TestScripts	folder	should	contain:)
[//]: # (1. Test	input	files	)
[//]: # (2. Test	configuration	files	if	any)	
[//]: # (3. Result	files	if	any)
[//]: # (4. Software	or	scripts	used	during	testing	if	any)






















[//]: # (3.2. Platform Testing D4)
[//]: # (• Describe	the	testing	processes	used	in	the development of	the	platform.	You	may	include	a	sub-folder	in	Phase_2	folder	to	include	any	data,	scripts	you	used	to	test	the	platform. • Describe	the	output	of	testing	and	what	actions	you	took	to	improve	the	test results.)
