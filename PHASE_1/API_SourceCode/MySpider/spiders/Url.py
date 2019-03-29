import scrapy
from MySpider.items import UrlItem
from scrapy.selector import Selector
import time

class urlSpider(scrapy.Spider):
    print('now getting url')
    #name
    name = 'urlSpider'
    allowed_domain = ['who.int']
    #page we need to scrapy
    url_list = []
    int_url = 'https://www.who.int/csr/don/archive/year/'
    # we currently just get 2019 and 2016
    for i in range(0, 4):
        year = 2019 - i
        url = int_url + str(year) + "/en/"
        url_list.append(url)

    start_urls = url_list
    print(start_urls)


    def parse(self, response):
        sel = Selector(response)
        item = UrlItem()
        for new in response.xpath("//ul[@class = 'auto_archive']//li"):
            url = new.xpath(".//@href").extract()[0]
            url = 'https://www.who.int' + url
            headline = new.xpath(".//span/text()").extract()[0]
            print(headline + '   ' + url)

            item['url'] = url
            item['headline'] = headline
            print('item')
            print(item)
            yield item
