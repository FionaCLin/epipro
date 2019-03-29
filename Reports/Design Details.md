# Design Detail
## Approach
[//]: # (## 2.1. Initial	documentation D1)
[//]: # (1. Describe how	you	intend	to	develop	the	API	module and	provide	the	ability to	run	it	in	Web	service	mode)
Before producing our API module design, we studied some of the relevant concepts in our problem domain. During this process, we will establish the domain model and sort out the relationships. Our resulting API modules will be designed based on our problem domain. We will build and display the API documentation within the Swagger editor, which will finally be developed in our designated platform and frameworks.

All the required handlers will be created for each of our API modules. Each API module will run in REST web service mode and will handle the corresponding REST request. Our web server will be built and host on the Google cloud platform, using a low cost App Engine Standard Environment. The EpiPro Application will then be able to serve REST API requests 24/7. More details on the Google App Engine is available [here](https://cloud.google.com/appengine/docs/).

## API Design Module
[//]: # (2. Discuss	your	current	thinking	about	how	parameters can	be	passed	to	your module	and	how	results	are	collected.	Show	an	example	of	a	possible interaction .e.g.- sample	HTTP	calls	with	URL	and	parameters)
### APIs Design
After brainstorming about the query parameters, studying the usage of the disease report for the API and refering to the specification requirements, we have concluded upon the REST API list below. The user is able to fetch and filter disease reports based on these three information queries:

#### Period of Interest
This refers to what specific time period the user is interested in for the disease report retrieval. We have two main APIs involved in this process. The first one helps retrieve all disease reports from the database, where the parameters are related to pagination e.g. start, limit. The second one helps filter by specific period in time, which can be passed to this module using the parameters indicating the beginning and/or end of this period e.g. start-date and end-date. Other optional parameters a filter by given keyterms or location.

#### Keyterms
The main API involving keyterms involves the category parameter, which helps group the keyterms given by the project specification. This parameter can only be given two values - 'general' or 'specific'. The API responds by returning general or specific keyterms, as outlined in the project specification.

#### Location
Location helps the user restrict the disease reports to a designated geographical location. Two main APIs are involved with this. The first one will return all locations mentioned in disease reports, with no additional input query parameter required. The second one accepts a parameter of the geonameID, and will respond with detailed information corresponding to the given geogrphical ID.

More details on the APIs structure available [here](https://epiproapp.appspot.com/api/v1/doc/) on the EpiPro Online Documentation.



# API design details 
### API architecture 
#### __GET /reports/filter__ 
This endpoint will return all the reports that satisfy user requirements. 
When all parameters are empty, the endpoint will return all disease reports existed in the database. 
All the parameters are optional, here are all 6 query parameters used in the endpoint. 
* __Start-date/End-date__: The period that user is interested in.  
No 'xx' accept here, user must enter valid dates. 
When no Start-date entered, it will be set to predefined date. The default Start-date is 2016-01-01T00:00:00. When End-date is empty, it will be set to current date time. 
Input Format: YYYY-MM-DDTHH:MM:SS  
* __Key-terms__: The keywords that user wants to search, case insensitive. 
Input Format: Keyword1,Keyword2,.. 
* __Location__: A location that user is concerned about,case insensitive. 
Input Format: User should enter the complete word, for example: if user enters 'sydn', nothing will return, instead user should enter 'sydney'. 
* __Start/Limit__: These parameters are for pagination. 
The default value for Start is 1, and for Limit is 100. 
Input Format: non-negative integer only. 

#### __GET /reports/key-terms/\<term_type\>__ 
This endpoint will return all predefined key terms from our database in case user doesn't know what to search. 
Here is the only path parameter: 

* __term_type__: There are two types of key terms: __[general]__ or __[specific]__, both  case insensitive. 
[general] is a wilder range keyword, for example: \"outbreak\", while [specific] refers to a limited but detailed range, for example: \"Zika\". 

#### __GET /reports/locations/\<area\>__
This endpoint will return all the locations information when given an area name. 
Usage example: When user want to know what cities are in in a certain country, saying Australia. User can enter Australia in \"area\", the endpoint will return all places that inside Austrlia. 
Here is the only path parameter in this endpoint: 

* __area__: a location name given by the user, case insensitive.  User should enter the complete word, for example: if user enters 'sydn', nothing will return, instead user should enter 'sydney'. 

#### __GET /reports/locations/all__
This endpoint will return all the locations that existed in the database. 

#### Reason for why create these four api

### Choice of implementation
flask
### Challenges addressed
how to search
location
dte
### Shortcomings
date comparison



===================================== still editting ===========================================
















### Collect Disease Reports
#### Webscraping with Scrapy and Selenium
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

#### Collection Process
The news and articles will be collected by our pre-defined Scraper from the searched and filtered url of the WHO website. We will then extract their title, url, content, published data, and region from the url's source file. Then, all the information will be processed and packed in the designated disease report format, and will be stored in our database. This process will recur will be autonomously performed monthly.

The disease reports collection process will proceed as described below:
* Filter region, period and data from the located WHO page's HTML code. The relevant WHO page will be located from the WHO main website by using keyword search, url and title. This process can be realized using the selector method in Scrapy. 
* Once relevant result is found, another Scraper is used to get the source from each url. As there are a great amount of articles and news, this process should shedule monthly and run concurrently with the other process.
* After raw data soure HTML files are retrived and the required data is extarcted and cleaned up, we compose and structure the disease reports. Using the structure of raw HTML file, xpath method can be utilised to find out required information for composing disease reports. Since the disease reports are retrived and updated monthly, the resulting disease reports will be cached in the database for serving application query.  

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

[//]: # (2.2. API	design	and	testing details	D2 )
[//]: # ( • Describe	final architecture	of	your	API,	justify	the	choice	of	implementation,	challenges	addressed	and	shortcomings.)
[//]: # (• Provide	the	URL	of	your	API	specification.)
## Challenges Addressed and Shortcomings
[//]: # (Challenges addressed - any problems encountered during API production and resolved)
[//]: # (Shortcomings - any problems encountered and not resolved/unable to meet requirements for certain parts)

