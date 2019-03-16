[//]: # ( 3.1. API	Testing D2)
# API Testing

[//]: # ( • Describe	the	testing	processes	used	in	the	development	of API,	referring	to	the	data	and	scripts	included	in	Phase_1	folder.	This	should	describe	your testing	environment	and/or tools	used,	and	limitation e.g.	things	that	are	not	tested.	Describe	your testing	process	i.e.	how	your	team	conducts	testing using	the	test	data	e.g.	in	which	order	and	an overview	of	test	cases,	testing	data	and	testing	results.)
## Testing Processes in Development of API
### Test Processes and Test Environment
During the development, we are going to apply Test-Driven Development(TDD) to ensure the functionalities of each system components. 
Because there are two major components in this stage, our Unit Testings are composed of API Unit Testing and Scapper Unit Testing. 

![Unit Testing System Components Diagram](testing-components.png "Unit Testing")

Utilising the url of the article as test input and the sample disease report data(sample_disease_report.json) from the project specification as the expected output in testing the developed the web scapping. 

Similarly, the same sample disease report data and the key terms data(key-terms.json) will be used as expected output to test querying all API methods. Additionally for an robust APIs, we are going to test extensively about all possible the invalid input and expected warning and error message.

### Test tools
 Unit Testing will be developed and run against each build. Unit testing for APIs and scraper are required for each function within our web server, and will be developed with Pytest. Since Pytest is the Flask built-in test framework.
### Limitation and Exception 
 Since the time constraint of the project, there are few things out of our test scope as follows:
 * API durability and performance
 * Scapper performance and regression analysis
 
[//]: # ( • Describe	the	output	of	testing	and	what	actions	you	took to	improve	the	test results. At	D2	your	Phase_1/TestScripts	folder	should	contain:)
[//]: # (1. Test	input	files	)
[//]: # (2. Test	configuration	files	if	any)	
[//]: # (3. Result	files	if	any)
[//]: # (4. Software	or	scripts	used	during	testing	if	any)






















[//]: # (3.2. Platform Testing D4)
[//]: # (• Describe	the	testing	processes	used	in	the development of	the	platform.	You	may	include	a	sub-folder	in	Phase_2	folder	to	include	any	data,	scripts	you	used	to	test	the	platform. • Describe	the	output	of	testing	and	what	actions	you	took	to	improve	the	test results.)
