# Design Detail
## 2.1. Initial	documentation D1

## Approach
[//]: # (Describe	how	you	intend	to	develop	the	API	module and	provide	the	ability to	run	it	in	Web	service	mode) 
Our API module is going to be designed in swagger editor and developed in our designate platform and frameworks. 


The API module will run in REST web service mode.


## API Design Module
[//]: # (Discuss	your	current	thinking	about	how	parameters can	be	passed	to	your module	and	how	results	are	collected.	Show	an	example	of	a	possible interaction .e.g.- sample	HTTP	calls	with	URL	and	parameters)
Several questions before we can design the api.
1 .Scrapper -from news how????? Some articles may just about disease not outbreak
2. What is a scrapper? Read through the articles and find the keywords? How it know whether is related to outbreak?
3. Api - only one? Or can have subset, can be invoked in different input situation?
4. If use python, we don’t need to write swagger
5. what else pai can we write?
6. we can write several apis besides data extractor? 


## Developement and Deployment Environment
[//]: # (Present	and	justify	implementation	language,	development	and	deployment environment .e.g.	Linux,	Windows	and	specific	libraries	that	you	plan	to	use.)

Because our team member are using different operating system (Linux, Window or Unix) and our developement enviroment would be vary, additionally our team members are more proficient in python. Therefore, implementation Language will be utilised python3 with a pre configurated virtual environment.

[//]: # (leave your preferrable framework, library here if you have any: Scapper-- fetch data, )

The deployment environment will be on google cloud app. 

