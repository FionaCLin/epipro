# Design Detail
## 2.1. Initial	documentation D1

## Approach
[//]: # (Describe	how	you	intend	to	develop	the	API	module and	provide	the	ability to	run	it	in	Web	service	mode)
Our API module is going to be designed in swagger editor and developed in our designate platform and frameworks.
Each API module will run in REST web service mode and handle the corresponding REST request. A web server will be built and created all the required handler for each API module.

## API Design Module

[//]: # (Discuss	your	current	thinking	about	how	parameters can	be	passed	to	your module	and	how	results	are	collected.	Show	an	example	of	a	possible interaction .e.g.- sample	HTTP	calls	with	URL	and	parameters)
We brainstorming about the query parameters for the API and according to the specification requirements. The user has to provide the 3 main information:
- period of interest
- key_terms
- location

```
bash
curl -x -V GET http://https://epiproapp.appspot.com/api/v1/deseasereport
```

```
bash
curl -x -V POST http://https://epiproapp.appspot.com/api/v1/deseasereport -H "Content-Type: application/json" -d '{"start_date":"2015-10-01T08:45:10", "end_date":“2015-11-01T19:37:12”}'
```

Several questions before we can design the api.
1 .Scrapper -from news how????? Some articles may just about disease not outbreak
2. What is a scrapper? Read through the articles and find the keywords? How it know whether is related to outbreak?
3. Api - only one? Or can have subset, can be invoked in different input situation?
4. If use python, we don’t need to write swagger
5. what else pai can we write?
6. we can write several apis besides data extractor?


## Developement and Deployment Environment
[//]: # (Present	and	justify	implementation	language,	development	and	deployment environment .e.g.	Linux,	Windows	and	specific	libraries	that	you	plan	to	use.)

Because our team member are using different operating system (Linux, Window or Unix) and our developement enviroment would be vary, additionally our team members are more proficient in python. Therefore, implementation Language will be utilised python3 with a pre configurated virtual environment. The API module will be built in Python3 and the application will be utilised the flask framework.

[[//]: #(Frontend to be design)

Our EpiPro Application will be hosted under this domain name [https://epiproapp.appspot.com/] and deployed and run in standard environment of google cloud app engine, because its microservices allow a large application to be decomposed into independent constituent parts. This enhance the cohesion of each part. To serve a single user or API request, our proposed microservices-based application can call many internal and external microservices or data source to compose its response.

What's more, its cloud platform has comprehensive documentation of hosting a flask python app under development and deployment. Moreover, it provides us with sufficient account quota to build and deploy our app for 12 months.


[//]: # (leave your preferrable framework, library here if you have any: Scapper-- fetch data, )

