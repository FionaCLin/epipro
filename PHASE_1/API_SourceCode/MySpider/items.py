# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class UrlItem(scrapy.Item):
    # define the fields for your item here like:
    headline = scrapy.Field()
    url = scrapy.Field()
    pass


class ContentItem(scrapy.Item):
    url = scrapy.Field()
    date_of_publication = scrapy.Field()
    headline = scrapy.Field()
    main_text = scrapy.Field()
    reports = scrapy.Field()
    pass
