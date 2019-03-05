# Design Detail
## 2.1. Initial	documentation D1
## Approach
[//]: # (Describe	how	you	intend	to	develop	the	API	module and	provide	the	ability to	run	it	in	Web	service	mode)
Before API module design, we study some of those concepts in our problem domain. Once those domain model and relationship have sort out. API modules are going to be designed based on our problem domain and then build and display the API documentation in swagger editor, finally it will be developed in our designate platform and frameworks.

A web server will be built and created all the required handlers for each API module. Each API module will run in REST web service mode and handle the corresponding REST request. Our web server will host and run on the Google cloud platform, using a low cost App Engine Standard Environment. The EpiPro Application is able to serve REST API request 24/7. [More detail about Google App Engine](https://cloud.google.com/appengine/docs/).

## API Design Module
[//]: # (Discuss	your	current	thinking	about	how	parameters can	be	passed	to	your module	and	how	results	are	collected.	Show	an	example	of	a	possible interaction .e.g.- sample	HTTP	calls	with	URL	and	parameters)
### APIs Design
After brainstorming about the query parameters and study the usage of the disease report for the API and according to the specification requirements. We have concluded the REST API list below. The user is able to fetch and filter disease reports based on these three  information mainly:
- period of interest
- key_terms
- location
The user is also able to retrieve the three main information details using our proposed APIs below.
```
# locations
GET /api/reports/locations/:geonameID
-- get a single location by id
    Response a single location object:
    {
      geoname_id: number,
      county: string,
      location: string,
      url: string,  --geoname_url
    }
GET /api/reports/locations
-- Index locations
  Response an array of locations

# key_terms
GET /api/reports/key-terms
-- Index all current key_terms
   Response an array of key_terms, each key_term contains id, type and name
   Query:
   type::string
   example: "general" or "specific"

# disease reports
GET /api/reports
-- Fetch disease reports
   Responses the recent 100 reports by default
   Query(optional):
   base::integer
   -- start from the n-th report
   limit::integer
   -- limit to the number of responseed reports
GET /api/reports/filter
-- Fetch disease reports by start date, end date, location, key_terms
   Response an array of disease reports
   Payload(application/json):
   {
      start-date: string,
      end-date: string,
      key_terms: strings,
      location: geoname_id
   }
```

[More Details on EpiPro Online Doc](https://epiproapp.appspot.com/api/v1/doc/)

### Collect Disease Reports
[//]: # (I used to use request or ulib.request to extract content of a url but I saw there is a scrapy file readly)
The news and articles are collected by our pre-defined Scraper from the provided url of WHO and extracted their title, url, content, published data, region, key word etc. Then all those information will process and pack as the designated disease report format and store them to our database every month.

As our data source is dynamic website as well as search key word, we decide to use selenium + scrapy/request frame work to build our scraper where selenium will be used to simulate usage of browser and srapy/request will be used to extract data.

[//]: # (Example about Python+Selenium+Scrapy[https://towardsdatascience.com/web-scraping-a-simple-way-to-start-scrapy-and-selenium-part-i-10367164c6c0]----give some reason why u want to do this)

The disease reports collection process consists of steps below:
### Steps 1 collect articles:
Find news with its title and url basing on region which can be selected in WHO main website and searched key word.
```
#search
searchBox = browser.find_element_by_xpath("//div[@class='keyword']/input[@type='text']")
searchBox.send_keys(keyWord)
```
Once relevant result is found, we can use another spider to get source from each of these url. To ensure efficiency we may use Thread pool to do this steps.
### Steps 2 extract details and cleaning data:
After raw soure file is gotten, we need to extarct required data from these HTML files. In order to do we need to analyse the struct of raw HTML file and extract deatail by using xpath method.

### Steps 3 sort data in disease report format:

### Steps 4 sore in mongodb：
Once relevant result is found, we can get source from each of these url and use regular expression or request to get other patameter. To ensure efficiency we may use Thread pool to do this steps.

## Developement and Deployment Environment
[//]: # (Present	and	justify	implementation	language,	development	and	deployment environment .e.g.	Linux,	Windows	and	specific	libraries	that	you	plan	to	use.)

### Developement
#### Flask Back-end Server
Because our team member are using different operating system (Linux, Window or Unix) and our developement enviroment would be vary, additionally our team members are more proficient in python. Therefore, implementation language will be utilised python3 with a pre configurated virtual environment. The API module will be built in Python3 and the application will be utilised the flask framework as well as the flask-restplus framework. Because it comes with the swagger. The swagger documentation for our EpiPro REST API will be updated and consistent within our fast development and deployment

###Export swagger from flask
```
Export as Swagger specifications
You can export the Swagger specififcations corresponding to your API.

from flask import json

from myapp import api

print(json.dumps(api.__schema__))
```
#### React Front-end
For the front-end, our team decided to choose React over AngularJS. AngularJS is a complex MVC framework whereas AngularJS is a library where it is primarily the ‘view’ portion of the MVC structure. This means that AngularJS gives us more design freedom, but also requires the developer to design the structure of the application. React also has the benefit of having the virtual DOM over AngularJS’ regular DOM, allowing us to better manage a large database. Additionally, the members involved in the front-end development are overall more familiar with React. This helps remove the learning curve of adjusting to AngularJS, to speed up development.

### Deployment
#### Host Environment
Our EpiPro Application will be hosted under this domain name [https://epiproapp.appspot.com/] and deployed and run in standard environment of google cloud app engine, because its microservices allow a large application to be decomposed into independent constituent parts. This enhance the cohesion of each part. To serve a single user or API request, our proposed microservices-based application can call many internal and external microservices or data source to compose its response.

What's more, its cloud platform has comprehensive documentation of hosting a flask python app under development and deployment. Moreover, it provides us with sufficient account quota to build and deploy our app for 12 months.
#### Data Storage
WHO is selected as our data source. As our app is more inclined to use by academics research and medical professionals. The disease report data are proposed to update and cache on the monthly basis. For retriving and storing external data soure, mongo db is selected for our project because it is widely used and get a lot of continuing supports from the mongo db community.  Additionally, some of our team members have previous experiences in it.
#### Testing and CICD
We are going to develop our testing for APIs with pytest, the flask built-in test framework. Also unit tests are required for each function within our web server.
We also plan to develop integration test for ensuring all related web services work together before it deployed to production enviroment.
Ideally, we aim to set up the travis CI testing within google cloud app engine, so as to streamline our development and deployment process.
