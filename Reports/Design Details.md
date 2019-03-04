# Design Detail

## Scraper
[//]: # (I used to use request or ulib.request to extract content of a url but I saw there is a scrapy file readly)
Our Scraper going to extract news with its title,url,content, published data,region,key word (any other things?) from out data source and store them to our database every month. The srapying process consist of two steps
### Steps 1 (Urlspider.py):
Find news with its title and url basing on region which can be selected in WHO main website and searched key word.
```
#search
searchBox = browser.find_element_by_xpath("//div[@class='keyword']/input[@type='text']")
searchBox.send_keys(keyWord)
```
### Steps 2 (ContentSpider.py)：
Once relevant result is found, we can get source from each of these url and use regular expression or request to get other patameter. To ensure efficiency we may use Thread pool to do this steps.
###
As our data source is dynamic website and we plan to search key word, we decide to use selenium + scrapy/request frame work to build our scraper where selenium will be used to simulate usage of browser and srapy/request will be used to extract data. 
Example about Python+Selenium+Scrapy[https://towardsdatascience.com/web-scraping-a-simple-way-to-start-scrapy-and-selenium-part-i-10367164c6c0]

## 2.1. Initial	documentation D1

## Approach
[//]: # (Describe	how	you	intend	to	develop	the	API	module and	provide	the	ability to	run	it	in	Web	service	mode)
Our API module is going to be designed in swagger editor and developed in our designate platform and frameworks.

A web server will be built and created all the required handler for each API module. Each API module will run in REST web service mode and handle the corresponding REST request. Our web server will host and run on the Google cloud platform, using a low cost App Engine Standard Environment. Therefore, the EpiPro Application is able to serve REST request 24/7.
More detail about Google App Engine[https://cloud.google.com/appengine/docs/].


## API Design Module

[//]: # (Discuss	your	current	thinking	about	how	parameters can	be	passed	to	your module	and	how	results	are	collected.	Show	an	example	of	a	possible interaction .e.g.- sample	HTTP	calls	with	URL	and	parameters)

### To be updated on Saturday
We brainstorming about the query parameters for the API and according to the specification requirements. The user has to provide the 3 main information:
- period of interest
- key_terms
- location

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

Our EpiPro Online Doc[https://epiproapp.appspot.com/api/doc/]


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
#### React Front-end (Ines)


### Deployment
#### Host Environment
Our EpiPro Application will be hosted under this domain name [https://epiproapp.appspot.com/] and deployed and run in standard environment of google cloud app engine, because its microservices allow a large application to be decomposed into independent constituent parts. This enhance the cohesion of each part. To serve a single user or API request, our proposed microservices-based application can call many internal and external microservices or data source to compose its response.

What's more, its cloud platform has comprehensive documentation of hosting a flask python app under development and deployment. Moreover, it provides us with sufficient account quota to build and deploy our app for 12 months.
#### Data Storage
WHO is selected as our data source. As our app is more inclined to use by academics research and medical professionals. The disease report data are proposed to update and cache on the monthly basis. For retriving and storing external data soure, mongo db is selected for our project because it is widely used and get a lot of continuing supports from the mongo db community.  Additionally, some of our team members have previous experiences in it.
#### Testing and CICD


[//]: # (leave your preferrable framework, library here if you have any: Scapper-- fetch data, )

