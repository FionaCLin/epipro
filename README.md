# SENG3011 EpiPro
## EpiPro
Team EpiPro has members:
* Ines Sarmiento z5120165
z5120165@student.unsw.edu.au
* Fiona Lin z5131048
fiona.lin@student.unsw.edu.au
* Shenghan Gao z5095104
shenghan.gao@student.unsw.edu.au
* Yuexuan Liu z5093599
z5093599@student.unsw.edu.au
## [Team	API	Documentation	URL](https://epiproapp.appspot.com/api/v1/doc/)

## Set Up Local Development
 - Install Development software
   - mongodb [Installation 
   manual](https://docs.mongodb.com/v3.4/installation/#mongodb-community-edition)
   - python3 & pip3 [Installation 
   manual](https://cloud.google.com/python/setup)

  - Seed sample data to the local mongodb
  ```
  python3 setup-database.py
  ```
  - Install dependent modules
  ```
  pip3 install -r PHASE_1/API_SourceCode/requirements.txt
  ```
  - Create config file
  Copy the config.sample.py and rename the copy of config.sample.py as `config.py`
  ```
  cp config.sample.py config.py
  ```
  - Run the application
  ```
  cd PHASE_1/API_SourceCode/
  FLASK_DEBUG=True FLASK_APP=main.py flask run --port 8080
  ```
