# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
from pymongo import MongoClient
import json
import pymongo
import re


class MyspiderPipeline(object):
    def __init__(self):
        print('now connect to db')
        self.client = MongoClient('mongodb://user001:admin12345@ds027483.mlab.com:27483/epipro_disease_report', 27017)
        self.db = self.client['epipro_disease_report']
        self.collection = self.db['reports']
        self.collection_2 = self.db['location']
        self.collection.create_index([('$**', 'text')])
        self.collection_2.create_index([('$**', 'text')])
        pass

    def process_item(self, item, spider):
        if spider.name == 'contentSpider':
            print(item)
            c = re.split(';', item['reports'][0]['report_events'][0]['location']['city'])
            for lo in c:
                words = re.split(',', lo)
                location = {}
                location['country'] = item['reports'][0]['report_events'][0]['location']['country']
                if len(words) == 2:
                    location['state'] = words[0]
                    location['city'] = words[1]
                    print('word 0 is  ' + words[0])

                    if self.collection_2.count_documents({"$text": {"$search": words[1]}}) > 0:
                        print('location exist')
                    else:
                        self.collection_2.insert_one(location)
                else:
                    location['state'] = ''
                    location['city'] = words[0]
                    print('word 0 is  ' + words[0])
                    if self.collection_2.count_documents({"$text": {"$search": words[0]}}) > 0:
                        print('location exist')
                    else:
                        self.collection_2.insert_one(location)

            print('#####################################')
            post = {}
            post['url'] = item['url']
            post['date_of_publication'] = item['date_of_publication']
            post['headline'] = item['headline']
            post['main_text'] = item['main_text']
            post['reports'] = []
            one_report = {}
            try:
                one_report['disease'] = item['reports'][0]['disease'][0]
            except BaseException:
                one_report['disease'] = ''
            try:
                one_report['syndrome'] = item['reports'][0]['syndrome'][0]
            except BaseException:
                one_report['syndrome'] = ''
            one_report['reported_events'] = []
            one_event = {}
            try:
                one_event['type'] = item['reports'][0]['report_events'][0]['type'][0]
            except BaseException:
                one_event['type'] = ''
            one_event['date'] = item['reports'][0]['report_events'][0]['date']
            one_event['location'] = {}
            one_event['location']['country'] = item['reports'][0]['report_events'][0]['location']['country']
            one_event['location']['location'] = item['reports'][0]['report_events'][0]['location']['city']
            one_event['number-affected'] = item['reports'][0]['report_events'][0]['number-affected']
            one_report['reported_events'].append(one_event)
            one_report['comment'] = None
            post['reports'].append(one_report)
            if self.collection.find_one(post):
                print('report exist')
            else:
                self.collection.insert_one(post)

           # location = {}
           # location['country'] = item['reports'][0]['report_events'][0]['location']['country']
           # location['state'] = ''
           # location['city'] = item['reports'][0]['report_events'][0]['location']['city']
           # print(location)
           # if self.collection_2.find_one(location):
           #     print('location exist')
           # else:
           #     self.collection_2.delete_one(post)
           #     self.collection_2.insert_one(location)
        # if
        # if spider.name == 'urlSpider':
         #   print(item)

    def open_spider(self, spider):
        pass

    def close_spider(self, spider):
        # self.client.close()
        pass
