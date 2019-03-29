import scrapy
from MySpider.items import ContentItem
from scrapy.selector import Selector
import re
import time
import json
class contentSpider(scrapy.Spider):

    #name
    name = 'contentSpider'
    allowed_domain = ['who.int']
    #page we need to scrapy

    url_list = []
    try:
        with open('urlSpider.json','rb') as x:
            u_list = json.load(x)
        for url in u_list:
            url_list.append(url['url'])
    except:
        print('read error')
        pass
    #url_list = ['https://www.who.int/csr/don/26-february-2019-mers-saudi-arabia/en/']
    start_urls = url_list

    #Extract data
    def parse(self, response):

        sel = Selector(response)
        item = ContentItem()
        types = ['presence', 'death', 'infected', 'hospitalised', 'recovered','deaths','infection']
        month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                 , 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December']
        number_bar = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9,'a': 1}
        happen_word = ['confirmed','reported','cases','case'] # we always can find number-affected in the sentence once these words appear
        location_word_1 = ['North','South']
        location_word_2 = ['province','district']
        location_word_3 = ['in']
        #url
        url = response.url
        print(url)
        #publication
        publication = str(response.xpath(".//div[@class = 'meta']//p").extract()[0])
        publication = publication.replace("\n", '')
        publication = publication.replace("<br>", '')
        publication = publication.replace('</p>', '')
        publication = publication.split("pan>")[1]
        year = publication.split(' ')[2]
        print('publication:' + time_tans(publication, year))
        #headline
        headline = response.xpath(".//h1[@class = 'headline']/text()").extract()[0]
        try:
            test = headline.split(' – ')[1]
        except:
            headline = response.xpath(".//h1[@class = 'headline']/text()").extract()[0] + response.xpath(".//h1[@class = 'headline']/text()").extract()[1]
        print(headline)
        #main
        main = response.xpath(".//div[@id = 'primary']//span/text()").extract()[1]
        #print(response.xpath(".//div[@id = 'primary']//span/i/text()").extract())
        if len(response.xpath(".//div[@id = 'primary']//span/i/text()").extract()) >0:
            main = main + ' ' + response.xpath(".//div[@id = 'primary']//span/i/text()").extract()[0] + ' ' \
                   + response.xpath(".//div[@id = 'primary']//span/text()").extract()[2]
        print(main)

        #report
        reports = []
        one_report = {}
        one_report['report_events'] = []

            #disease
        print('disease:')
        with open('disease_list.json') as diseases:
            d_list = json.load(diseases)
        disease_find = []
        for name in d_list:
            if name['name'] in str(main).lower():
                disease_find.append(name['name'])
                print(name['name'])
        one_report['disease'] = disease_find

            #syndrome
        print('syndrome:')
        with open('syndrome_list.json') as syndrome:
            s_list = json.load(syndrome)
        syndrome_find = []
        for name in s_list:
            if name['name'] in str(main).lower():
                syndrome_find.append(name['name'])
                print(name['name'])
        one_report['syndrome'] = syndrome_find

            #event
        one_event = {}
        content = re.split('[.,]', main)
        type_find = []

                #type
                #different should be in different event
        print('type:')
        for name in types:
            if name in str(main).lower():
                type_find.append(name)
                print(name)
        one_event['type'] = type_find
                #date
        num_date = []
        event_date = ''

                # location
                # I have not found a good way to find location name in text
        location = {}
        location['country'] = headline.split(' – ')[1]
        citys = []
                #number-affectted
        affected = 0
        print('country:' + location['country'])
                #content analyse
        for sentence in content:
            words = sentence.split(' ')
            word_counter = 0
            #location
            if len(words) == 1 and '(' in words:
                place = words[0].strip('(').strip(')')
                citys.append(place)
            for word in words:
                #date
                if word in month:
                    if words[word_counter-1].strip('(').isdigit():
                        day = words[word_counter-1] + ' '+ words[word_counter]
                        num_date.append(time_tans(day, year))
                #location
                if word in location_word_1:
                    places = word + ' ' + words[word_counter + 1]
                    citys.append(places)
                if word in location_word_2:
                    places = word + ' ' + words[word_counter - 1]
                    citys.append(places)
                if word in location_word_3 and re.match("^[A-Z].*", words[word_counter + 1]):
                    places = words[word_counter + 1]
                    citys.append(places)
                if word in location_word_3 and words[word_counter + 1] is 'the 'and re.match("^[A-Z].*", words[word_counter + 2]):
                    places = words[word_counter + 2]
                    citys.append(places)
                if re.match(r"\(([0-9])*\)", word) != None:
                    place = words[word_counter - 1]
                    citys.append(place)
                #number_affected
                if word in happen_word:
                    for x in words[0:word_counter]:
                        if x in number_bar.keys():
                            affected = str(number_bar[x])
                            break
                        if x.isdigit():
                            affected = x
                            break

                word_counter = word_counter + 1
        #date
        if len(num_date) == 2:
                event_date = num_date[0] + ' to ' + num_date[1]
        else:
                event_date = num_date[0]
        print('date: ' + event_date)
        one_event['date'] = event_date
        #location
        print('location:')
        print(citys)
        L = ''
        for x in citys:
            L = L + x + ';'

        L = re.split(";$",L)[0]
        print('L:' + L)
        location['city'] = L
        one_event['location'] = location
        #aff
        print('number-affeted:' + str(affected))
        one_event['number-affected'] = affected

        one_report['report_events'].append(one_event)
        reports.append(one_report)

        #generate item
        item['url'] = url
        item['date_of_publication'] = time_tans(publication, year)
        item['headline'] = headline
        item['main_text'] = main
        item['reports'] = reports






        print()
        yield item


def time_tans(t,year):
    # 2018-12-12Txx:xx:x
    data = str(year)
    if 'Jan' in t:
        data = data + '-01'
    if 'Feb' in t:
        data = data + '-02'
    if 'Mar' in t:
        data = data + '-03'
    if 'Apr' in t:
        data = data + '-04'
    if 'May' in t:
        data = data + '-05'
    if 'Jun' in t:
        data = data + '-06'
    if 'Jul' in t:
        data = data + '-07'
    if 'Aug' in t:
        data = data + '-08'
    if 'Sep' in t:
        data = data + '-09'
    if 'Oct' in t:
        data = data + '-10'
    if 'Nov' in t:
        data = data + '-11'
    if 'Dec' in t:
        data = data + '-12'

    data = data + '-' + t.split(' ')[0].strip('(').strip(')') + 'Txx:xx:xx'

    return data
