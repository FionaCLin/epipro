# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
from pymongo import MongoClient
import json
class MyspiderPipeline(object):
    def __init__(self):
        print('now connect to db')
        client = MongoClient('mongodb://user001:admin12345@ds027483.mlab.com:27483/epipro_disease_report', 27017)
        self.db = client['epipro_disease_report']
        self.collection = self.db['reports']
        self.collection.create_index([('$**', 'text')])

    def process_item(self, item, spider):
        if spider.name == 'contentSpider':
            post = dict(item)
            self.collection.insert_one(post)

    def open_spider(self, spider):
        pass

    def close_spider(self, spider):

        pass
        return item
