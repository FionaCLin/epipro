# Design Detail
## Approach
[//]: # (## 2.1. Initial	documentation D1)
[//]: # (1. Describe how	you	intend	to	develop	the	API	module and	provide	the	ability to	run	it	in	Web	service	mode)
Before producing our API module design, we studied some of the relevant concepts in our problem domain. During this process, we will establish the domain model and sort out the relationships. Our resulting API modules will be designed based on our problem domain. We will build and display the API documentation within the Swagger editor, which will finally be developed in our designated platform and frameworks.

All the required handlers will be created for each of our API modules. Each API module will run in REST web service mode and will handle the corresponding REST request. Our web server will be built and host on the Google cloud platform, using a low cost App Engine Standard Environment. The EpiPro Application will then be able to serve REST API requests 24/7. More details on the Google App Engine is available [here](https://cloud.google.com/appengine/docs/).


## Scrapper Design Module

### Webscraping with Scrapy and Selenium
As our data source WHO is a dynamic website which also provides search and filter functionalities, we chose Selenium and Scrapy frameworks to build and define our web scraper, over other alternatives like BeautifulSoup, Pyspider and Portia.

<table>
    <tbody>
        <tr align="center">
            <th></th>
            <th>Scrapy</th>
            <th>BeautifulSoup</th>
            <th>Pyspider</th>
            <th>Portia</th>
        </tr>
        <tr>
            <th align="center">Pros</th>
            <td>
                <ul>
                    <li>Has the most community support and documentation</li>
                    <li>Great performance in web scraping</li>
                    <li>Suitable for broad crawling</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>Easy to use</li>
                    <li>Good for very simple projects</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>Easy to use UI</li>
                    <li>Facilitates fast web scraping</li>
                    <li>Suitable for website-based user interfaces</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>Visual scraping tool without programming</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th align="center">Cons</th>
            <td>
                <ul>
                    <li>Larger learning curve</li>
                    <li>Does not handle JavaScript</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>Requires multiprocessing import to improve performance</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>Difficult to deploy</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>More time-consuming than other alternatives</li>
                    <li>Difficult to control how it navigates websites (can lead to unnecessary page visits)</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

First of all, Scrapy was the recommended webscraping tool for this specific workshop, and therefore should by our baseline for our comparisons. Both BeautifulSoup and Portia are easier to use and has a smaller learning curve than Scrapy. Portia has the added benefit of being a visual scraping tool, which does not require programming knowledge. However, Scrapy performs more efficiently and more web pages can be crawled in a shorter amount of time. PySpider, similarly to Portia, has an easy to use UI, but also facilitates faster scraping. Despite this, it still is more difficult to deploy than Scrapy. Scrapy also has greater documentation and community support than all of BeautifulSoup, Pyspider and Portia. Therefore, these alternatives can be disregarded.

However, Scrapy alone does not work for all web pages. Although it is considered the most suitable for properly rendering XML and HTML pages across a large data set, it does not handle JavaScript well. We also need to consider JavaScript frameworks driven pages such as React and Angular, which means, in practice, that there will be different kinds of timers and interactive elements involved. Another peculiarity of Scrapy is that it goes through pages by accessing their URLs. However, there are some buttons on the webpages which won’t have any URLs linked to them when you inspect the element or get the source code (through xpath or css). Therefore, Selenium will be used as our testing automation framework, on top of our Scrapy web crawling framework. Selenium will help simulate browser usage to retrive data from those JavaScript frameworks driven web pages, and requesting with Scrapy will be used to get the required data in a data file format during collection process.

### Collection Process
The news and articles will be collected by our pre-defined Scraper from the searched and filtered url of the WHO website. We will then extract their title, url, content, published data, and region from the url's source file. Then, all the information will be processed and packed in the designated disease report format, and will be stored in our database. This process will recur will be autonomously performed monthly.

The disease reports collection process will proceed as described below:
* Filter region, period and data from the located WHO page's HTML code. The relevant WHO page will be located from the WHO main website by using keyword search, url and title. This process can be realized using the selector method in Scrapy. 
* Once relevant result is found, another Scraper is used to get the source from each url. As there are a great amount of articles and news, this process should shedule monthly and run concurrently with the other process.
* After raw data soure HTML files are retrived and the required data is extarcted and cleaned up, we compose and structure the disease reports. Using the structure of raw HTML file, xpath method can be utilised to find out required information for composing disease reports. Since the disease reports are retrived and updated monthly, the resulting disease reports will be cached in the database for serving application query.  

### Implementation method  
We used Python scrappy library to develop our scraper. The scraper consist of two spiders - url spider and content spider. The url spider is used to access and cache headline with urls of news from our data source, while the content spider is used to access the content of these urls and extract report data from the main text. The structure of our implementation contains:
* Items - defined the object field we need to crawl from data source
* Spider - access and extract data 
* Pipelines - formalizing the item and storage  
  
There are two main reasons we decided to use this structure. Firstly, we can segment the date access and storage processes so that we formalize our report structure easier on the pipeline. Moreover, we can store our data individually which avoid usage of long list

### Challenge addressed
The key challenge of our scraper is extract required data from the main text. Located the data basing on appearance of some special word. For example, it is likely to get the affected number on the sentence with verb 'reported', 'confirmed'. For those unsolved cases we manually extract on the pipelines process. We also implemented some functions to recognize and compare time in the main text


## API Design Module
[//]: # (2. Discuss	your	current	thinking	about	how	parameters can	be	passed	to	your module	and	how	results	are	collected.	Show	an	example	of	a	possible interaction .e.g.- sample	HTTP	calls	with	URL	and	parameters)


### EpiPro API Online Documentation  
APIs live demonstration available [here](https://epiproapp.appspot.com/api/v1/doc/)  
  
### API architecture  
After brainstorming about the query parameters, studying the usage of the disease report for the API and refering to the specification requirements, we have concluded upon the REST API list below: 
  
#### __GET /reports/filter__ 
This endpoint will return all the reports that satisfy user requirements. 
When all parameters are empty, the endpoint will return all disease reports existed in the database. 
All the parameters are optional, and these are all 6 query parameters that can be used in the endpoint: 
* __Start-date/End-date__: This refers to what specific time period the user is interested in for the disease report retrieval.  
No 'xx' values aree accepted here and the user must enter valid dates.  
When no Start-date is entered, it will be set to a predefined date. The default Start-date is 2016-01-01T00:00:00. When End-date is empty, it will be set to current date time.  
Input Format: YYYY-MM-DDTHH:MM:SS   
* __Key-terms__: The keywords that user wants to search. This is case insensitive.   
Input Format: Keyword1,Keyword2,.. 
* __Location__: Location helps the user restrict the disease reports to a designated geographical location, and it is case insensitive.  
Input Format: User should enter the complete word, e.g. if user enters 'sydn', nothing will return, instead user should enter 'sydney'. 
* __Start/Limit__: These parameters are for pagination. 
The default value for Start is 1, and for Limit is 100.  
Input Format: non-negative integer only. 

#### __GET /reports/key-terms/\<term_type\>__ 
This endpoint will return all predefined key terms from our database in case the user doesn't know what to search. 
Here is the only path parameter: 

* __term_type__: This parameter helps group the keyterms given by the project specification and  can only be given two values:  __[general]__ or __[specific]__, where both case insensitive. 
[general] is a wilder range keyword e.g. \"outbreak\", while [specific] refers to a limited but detailed range e.g. \"Zika\". 

#### __GET /reports/locations/\<area\>__
This endpoint will return all the locations information when given an area name. 
Usage example: When user want to know what cities are in in a certain country, saying Australia. User can enter Australia in \"area\", the endpoint will return all places that are within Austrlia. 
Here is the only path parameter in this endpoint: 

* __area__: a location name given by the user, which is case insensitive.  User should enter the complete word e.g. if user enters 'sydn', nothing will return, instead user should enter 'sydney'. 

#### __GET /reports/locations/all__  
This endpoint will return all the locations that existed in the database. 
  
__Justification__: We deleted the endpoint GET /reports/all, since our latest GET /reports/filter will return all disease reports in the database, which has the same function as GET /reports/all.  
  
### Justification for API modules
Here are the reasons why we chose to create the 4 APIs, as seen above.  
  
__For GET /reports/filter__:  
This is required in spec, but we added two extra parameters: Start and Limit. Considering that there is a considerable size to the amount of disease reports where each contains lots of information, it's better to provide pagination function so that user can fetch small chunk of reports and have better evaluation on the presentation of the information.  
  
__For GET /reports/key-terms/\<term_type\>__:  
This one is necessary because keywords can cover a wide range, from disease type to syndrome to headline. If we don't provide some typical keywords, users may have no idea where to start their search. We also divided the keyword range into __general__ and __specific__, which allows the user to understand how to utilize this endpoint to do different scales of search.  
  
__For GET /reports/locations/area__:  
We provided this endpoint to allow users to get valid location information from a certain area. The importance of this endpoint is that user can use it to know which cities are under a certian country/state and also which several sub-areas have disease reports stored in the database. Some remote countries may have many small cities without any valid disease reports. This endpoint will save the time by not showing the city name so that user can know there is no related report stored within our database.  
  
__For GET /reports/locations/all__:  
We considered that the user may require this endpoint to do a location drop down list, were it can autocomplete. It's convenient to give all locations to user at one time.  

### Challenges addressed
Search is the main challenge we met during implementation.  
Search involves 3 main ranges - keyword searching, date searching, and inclusive location searching.  
  
* __Keyword Search__:  
This is the most difficult and important task in the api. As for a normal MongoDB search, we usually use the index search alongside find() from the MongoDB command. This means that if we adopt this method to do the keyword search, we need to know the exact index of the keyword. For example, when the keyword is \"Acute Flacid Paralysis\", firstly we have to know this keyword is of index \"syndrome\" and then we can search for the reports with find() method. This requires a lot more effort and time to finish one single search, which can be inefficient.  
Starting from version 2.4, MongoDB began with an experimental feature supporting Full-Text Search using Text Indexes. This full text search provides us with a high speed searching, allowing us to search throughout the whole report without knowing which index the input keyword exactly should be in.  
  
* __Date Search__:  
The challenge in a date search is the date accuracy. Since the specification allows some "xx" included in the datetime string, it's hard to tell whether the date is inside the time range given by user.  
Firstly we have to clarify that the date we search here is __date of publication__ in report.  
Secondly, the start and end date given by user must be accurate date time (without xx).  
To solve this problem, we assume that all the "xx" in the date of publication is equal to the start date given by user.  
For example, when the date of publication is 2019-01-13Txx:xx:xx, the start date given by the user is 2019-01-12T12:32:22. Our api will proceess the date of publication to 2019-01-13T12:32:22, and then perform the comparison.  
  
* __Inclusive Location Search__:  
We provided an inclusive location search, which means, when user searches with a wider range location, results from all inclusive locations will also be presented. For example, when user searches \"Australia\", the results will not only send back reports that contain Australia, but also all reports include other states like "New South Wales" and other cities like "Melbourne" that are inside Australia.
Our solution is whenever our scrapper extracts location information from the WHO website, it will also invoke the api from "http://www.geonames.org/", in order to get the complete __Country/State(if applicable)/City__. First, we store country info in the index __location[country]__, and put the state and city info in __location[location]__, in the \"CITY, STATE\"  string format.  At the same time, we also stored __Country/State(if applicable)/City__ in json format into our __location__ collection in the database.  
If only the location "Sydney" occurs in the original website article, when we don't use above method, the __location__ entry inside the disease report should look like this:  
```javascript
location: {
    'country':'',
    'location':'Sydney'
}
```  
If the user searches "Austalia", this report will not be returned as there is no "Australia" occurring in the report.  
However, after using our method, the new json should look like this:  
```javascript
location: {
    'country': 'Australia',
    'location': 'Sydney, New South Wales'
}
```  
At this time, we can use full text search again to search "Australia", and the report will be returned as expected.  
  
### Shortcomings  
Our shortcoming is that we cannot deal with the situation where the user inputs Start-date or End-date with \'xx\'. We forced the users to enter complete datetime in order to limit cases we have to concern. Although this is a drawback for user input flexiability, it allows us to get a complete and valid time range, and allow a more accurate search result for users. For our purposes, this is a reasonable tradeoff.  

  
### Logger  
We have an auto-generated log file under /PHASE1/API_SourceCode/Api_log.log. It contains the time that request happened, the requested URL and the status code it returns. Each time the Api restarts, it will be overwritten and log the latest information.  
  

## Developement and Deployment Environment
### Developement
#### Flask Back-end Server
All our team members are more proficient in Python and Python is available across different platforms. As a result, although there are great choices of web stack out there,  we preferred Python as selected as our implementation language with a pre configurated virtual environment. We considered other alternatives like Ruby for Ruby on Rails and Node.js for Express. Ruby, despite having lots of features for web development has too much flexibility, making code to be hard to edit and sometimes working 'magically'. Node.js has great performance and speed for real-time applications, but is less familiar to our team. In terms of ease of use and familiarity, Python3 would make development easier and has easier ways to uphold maintainance and error-handling. Therefore we can ensure the usability, reliability and stability of our proposed system. Additionally, our team members can still have Python3 installed despite using different operating system (Linux, Window or Unix) and varying developement enviroments. So, Python3 caters to all of our members' needs.

As the API module will be built in Python3, we cannot consider using Ruby on Rails or Express any further. However, since we are using Python3, we ultimately chose to use Flask over Django as our backend framework. Django has a lot of features added on to it for more complex web applications, in comparison to Flask which is simpler and more direct to use. However, these additional features also mean an increased learning curve, which our team is trying to avoid. But, Flask by itself is not sufficient enough when supporting the development of REST APIs. This means we should use the Flask-RESTPlus alongisde our Flask framework.

In terms of documentation, we will be using the Swagger documentation generation, which comes with both the Flask and Flask-RESTPlus frameworks. The Swagger documentation for our EpiPro REST API will be written and updated in our source code, so as to be consistent with our fast development and deployment, as well as the standardized API design. The Swagger documentation is a sophisicated documentation maintaining tool. It can help us generate a hosted, interactive API documentation site, and it can export the API documentation in an JSON format to facilitate the API life cycle.

#### React Front-end
For the front-end, our team decided to choose React over Vue, Ember and AngularJS. Out of our four options, we were least familiar with Vue and Ember, and therefore didn't consider it further. AngularJS is a complex MVC framework whereas React is a library where it is primarily the ‘view’ portion of the MVC structure. This means that React gives us more design freedom, but also requires the developer to design the structure of the application. React also has the benefit of having the virtual DOM over AngularJS’ regular DOM, which helps render the application's UI faster. Additionally, the members involved in the front-end development are overall more familiar with React. This helps remove the learning curve of adjusting to AngularJS, to speed up development.

We will also be using TypeScript alongside React. Even though our team is more familiar with JavaScript, TypeScript is similar to pure JavaScript with the added bonus of a statically typed language. This means that the code will be easier to understand (using our IDE), and it will be easier to debug since it would be harder to introduce invalid code during compilation. 

### Deployment
#### Host Environment
Our EpiPro Application will be hosted under this domain name -- https://epiproapp.appspot.com/, and deployed and run in the standard environment of the Google Cloud app engine. Its microservices allows a large application to be decomposed into independent constituent parts, which enhances the cohesion of each part. To serve a single user or API request, our proposed microservices-based application can call many internal and external microservices or data sources to compose its required response.

The Google Cloud platform also has comprehensive documentation and tutorials, as well as code example of hosting a Flask Python app under development and deployment. Moreover, it provides us with a sufficient free trial account quota to build and deploy our app for 12 months. It successfully satifies our EpiPro Application requirement to serve REST API request 24/7.

#### Data Storage
WHO is selected as our data source since our app is more inclined to use by academics research and medical professionals. The disease report data are proposed to update and cache on the monthly basis. For retrieving and storing external data soure, we considered multiple database options, including MySQL, Redis and OrientDB. For our purposes, we required an option that did not have a large learning curve and was familiar to our team, therefore eliminating OrientDB and Redis as viable choices. This left us choosing between MySQL and MongoDB. Both of these options have a strong support by their communities and had supporting resources. MySQL is more suitable for projects that require multi-row transactions and stores data in rows and tables. This would make it suitable for something more like an accounting system, rather than our current project. MongoDB is suitable for projects that require rapid prototyping, has ease of use, stores its data in JSON-like documents and is a solution that can work with unstructured data. By comparison, MongoDB would be a more useful for us due to the JSON-like storage over tabular storage, and its suitability to prototyping.

#### Testing and CICD
Testing is vital to create our system components. To ensure that every build of the project works properly, unit tests will be developed and run against each build. Unit testing for APIs are required for each function within our web server, and will be developed with Pytest over Nose and Unittest. While all of these are viable unit testing solutions in Python, Pytest provides the most compact solution. Unittest, in comparison to Pytest, has more boiler plate code and Nose has less readable error reports than Pytest. Pytest is also more actively supported by its community than these two other alternatives. This allows us to have a greater access to other extensions, on top of Pytest.

![CI Testing Diagram](continuous-delivery-with-travis-ci-1architecture.png "CI Testing") CI Testing Diagram sources from [Implementing continuous delivery with Travis CI and App Engine](https://cloud.google.com/solutions/continuous-delivery-with-travis-ci)

For integration testing, we looked into both Travis CI and Jenkins as potential tools for continuous integration. Jenkins would be a more preferable chioce if our code was hosted from in house, while Travis CI should be used if the code repository is at GitHub. However, Jenkins requires the developers to host, install and configure it, while Travis is a hosted service. Therefore, we chose Travis CI over Jenkins.

Since Travis integrates with GitHub and runs tests in isolation, it can run on the Google Cloud Platform without much maintaince on our own infrastructure.
[More Detail on Travis CI testing within Google Cloud App Engine](https://cloud.google.com/solutions/continuous-delivery-with-travis-ci). Hence, our integration tests will be developed on Travis CI and used by a CI/CD service on Google Cloud Platform (GCP) to deploy your app as part of the build process.

We will apply the practice of continuous integration (CI) and continuous delivery (CD), which involves using tools like Travis CI, to ensure that all new code is automatically and consistently tested for errors. This allows us to streamline our development and deployment process, as well as ensure developed components work within the production environment and all related web services work together before it is deployed to the production enviroment. Continuous delivery (CD) goes one step further by ensuring we can deploy every build into a production-like environment and then pass integration tests in that environment.

