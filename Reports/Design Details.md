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
[More Details on EpiPro Online Doc](https://epiproapp.appspot.com/api/v1/doc/)

### Collect Disease Reports
As our data source is dynamic website as well as search key word, we decide to use selenium + scrapy/request frame work to build our scraper where selenium will be used to simulate usage of browser and srapy/request will be used to extract data.

The news and articles are collected by our pre-defined Scraper from the provided url of WHO and extracted their title, url, content, published data, region, key word etc. Then all those information will process and pack as the designated disease report format and store them to our database every month.

The disease reports collection process describe as below:
Find news with its title and url basing on region which can be selected in WHO main website and searched key word.
Once relevant result is found, another spider/scapper? is used to get source from each of these url. 
Since this data source is retrived and updated monthly, the result is going to cached for serving application query.

[//]: # (how this achieve the efficiency??? To ensure application efficiency we may use Thread pool to do this steps. )
After raw data soure html file is retrived, required data is going to be extarcted and clean up from these HTML files. In order to analyse the struct of raw HTML file and extract detail, xpath method is used and sort out the raw data in disease report format. Once relevant disease reports are formed and cached, search query is running against to each of these url also use regular expression or query string in request to get other patameter. 

[//]: # (To ensure efficiency we may use Thread pool to do this steps.?)
## Developement and Deployment Environment
[//]: # (Present	and	justify	implementation	language,	development	and	deployment environment .e.g.	Linux,	Windows	and	specific	libraries	that	you	plan	to	use.)

### Developement
#### Flask Back-end Server
Because all team members are more proficient in python and python is available across different platforms. Although there are great choices of web stack out there,  Python is selected as our implementation language with a pre configurated virtual environment. Utilising python3 can reduce our learning curve also it smooths the project development as well as let us focus on API design and implementation. Therefore we can ensure the usability, reliability and stability of our proposed system. Additionally, our team members are using different operating system (Linux, Window or Unix) and our developement enviroment would be vary and since all of us have install python3. So python3 caters all members' needs.

As the API module will be built in Python3, the application will be utilised the flask framework as well as the flask-restplus framework. Because flask and flask-restplus come with the swagger documentation generation. The swagger documentation for our EpiPro REST API will be written and updated in our source code, so as to be consistent within our fast development and deployment as well as standardized API design. The swagger documentation is a sophisicated documentation maintaining tool. It can help us generate a hosted, interactive API documentation site additional it can export the API documentation in an json format and facilitate the API lifecyce.

#### React Front-end
For the front-end, our team decided to choose React over Vue, Ember and AngularJS. Out of our four options, we were least familiar with Vue and Ember, and therefore didn't consider it further. AngularJS is a complex MVC framework whereas React is a library where it is primarily the ‘view’ portion of the MVC structure. This means that React gives us more design freedom, but also requires the developer to design the structure of the application. React also has the benefit of having the virtual DOM over AngularJS’ regular DOM, which helps render the application's UI faster. Additionally, the members involved in the front-end development are overall more familiar with React. This helps remove the learning curve of adjusting to AngularJS, to speed up development.

We will also be using TypeScript alongside React. Even though our team is more familiar with JavaScript, TypeScript is similar to pure JavaScript with the added bonus of a statically typed language. This means that the code will be easier to understand (using our IDE), and it will be easier to debug since it would be harder to introduce invalid code during compilation. 


### Deployment
#### Host Environment
Our EpiPro Application will be hosted under this domain name -- https://epiproapp.appspot.com/, and deployed and run in standard environment of google cloud app engine, because its microservices allow a large application to be decomposed into independent constituent parts. This enhance the cohesion of each part. To serve a single user or API request, our proposed microservices-based application can call many internal and external microservices or data source to compose its response.

What's more, google cloud platform has comprehensive documentation and tutorial as well as code example of hosting a flask python app under development and deployment. Moreover, it provides us with sufficient free trial account quota to build and deploy our app for 12 months. It meets our EpiPro Application requirement to serve REST API request 24/7.

#### Data Storage
WHO is selected as our data source. As our app is more inclined to use by academics research and medical professionals. The disease report data are proposed to update and cache on the monthly basis. For retriving and storing external data soure, mongo db is selected for our project because it is widely used and get a lot of continuing supports from the mongo db community. Additionally, some of our team members have previous experiences in it on mLab and the ten weeks time constraits for our project. So mongo db is selectd and is able to speed up the project development.

#### Testing and CICD

Testing is vital to create system component. To ensure every build of the project working properly, unit tests are developed and run against to each build. Our unit testing for APIs are required for each function within our web server and developed with pytest. Pytest is the flask built-in test framework. 
![CI Testing Diagram](continuous-delivery-with-travis-ci-1architecture.png "CI Testing") CI Testing Diagram sources from [https://cloud.google.com/solutions/continuous-delivery-with-travis-ci]


Since Travis integrates with GitHub, runs tests in isolation, when running on Google Cloud Platform without much maintaince on our own infrastructure.
[More Detail on Travis CI testing within Google Cloud App Engine](https://cloud.google.com/solutions/continuous-delivery-with-travis-ci). Hence, our integration tests are developed and used by a CI/CD service on Google Cloud Platform (GCP) to deploy your app as part of the build process.

We are going to apply the practice of continuous integration (CI) and continuous delivery (CD), which involves using tools like Travis CI, to ensure that all new code is automatically and consistently tested for errors, so as to streamline our development and deployment process as well as ensure developed components working in production environment and all related web services work together before it deployed to production enviroment. Additionally, continuous delivery (CD) goes one step further by ensuring you can deploy every build into a production-like environment and then pass integration tests in that environment. 
