import scrapy
from MySpider.items import ContentItem
from scrapy.selector import Selector
import re
import requests
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
    #url_list = ['https://www.who.int/csr/don/22-february-2018-lassa-fever-liberia/en/']
    start_urls = url_list

    #Extract data
    def parse(self, response):

        sel = Selector(response)
        item = ContentItem()
        types = ['presence', 'death', 'infected', 'hospitalised', 'recovered','deaths','infection']
        month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                 , 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October','November', 'December'
                 , 'January,', 'February,', 'March,', 'April,', 'May,', 'June,', 'July,', 'August,', 'September,', 'October,','November,', 'December,']
        number_bar = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9}
        happen_word = ['confirmed','reported','cases'] # we always can find number-affected in the sentence once these words appear
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
            if str(name['name']).lower() in str(main).lower():
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
                    print('word in month')
                    if words[word_counter-1].strip('(').isdigit():
                        min_year = year
                        day = words[word_counter-1] + ' '+ words[word_counter]
                        try:
                            if words[word_counter + 1].strip('(').isdigit():
                                min_year = words[word_counter + 1]
                        except:
                            pass
                        num_date.append(time_tans(day, min_year))

                #location
                if word in location_word_1:
                    try:
                        places = words[word_counter + 1]
                        citys.append(places)
                    except:
                        pass
                if word in location_word_2:
                    places = words[word_counter - 1]
                    citys.append(places)
                if word in location_word_3 and re.match("^[A-Z].*", words[word_counter + 1]) and words[word_counter + 1] not in month :
                    places = words[word_counter + 1]
                    try:
                        if re.match("^[A-Z].*", words[word_counter + 2]):
                            places = places + ' ' + words[word_counter + 2]
                    except:
                        pass
                    citys.append(places)
                if word in location_word_3 and words[word_counter + 1] is 'the 'and re.match("^[A-Z].*", words[word_counter + 2]):
                    places = words[word_counter + 2]
                    citys.append(places)
                if re.match(r"\(([0-9])*\)", word) != None:
                    place = words[word_counter - 1]
                    citys.append(place)
                #number_affected
                if word in happen_word and affected ==0 :
                    for x in words[0:word_counter]:
                        if x in number_bar.keys():
                            affected = number_bar[x]
                            break
                        if x.isdigit():
                            affected = x
                            break

                word_counter = word_counter + 1
        #date
        if len(num_date) == 2:
            if is_before(num_date[0], num_date[1]) == True:
                event_date = num_date[0] + ' to ' + num_date[1]
            else:
                event_date = num_date[1] + ' to ' + num_date[0]
        elif len(num_date) == 1:
            event_date = num_date[0]
        elif len(num_date) == 0:
            event_date = ''
        else:
            if is_before(num_date[1], num_date[2]) == True:
                event_date = num_date[1] + ' to ' + num_date[2]
            else:
                event_date = num_date[2] + ' to ' + num_date[1]
        print('date: ' + event_date)
        one_event['date'] = event_date
        #location
        print('location:')
        print(citys)
        L = ''
        #use geiname API
        better_city = []
        for x in citys:
            if x in location['country']:
                continue
            city_name = re.split(' ',x)
            api_target =  'http://api.geonames.org/searchJSON?q='
            api_target = api_target + city_name[0]
            try:
                for w in city_name[1:-1]:
                    api_target = api_target + '+' +  w
            except:
                pass
            country_name = re.split(' ',location['country'])
            api_target = api_target + '+' + country_name[0]
            try:
                for w in country_name[1:]:
                    api_target = api_target + '+' +  w
            except:
                pass
            api_target = api_target + '+' + '&maxRows=1&featureClass=A&username=jiedian233'

            #print('api: ' + api_target)
            rs = requests.get(api_target)
            rs_dict = json.loads(rs.text)
            #print(rs_dict)
            add = ''
            try:
                add = rs_dict['geonames'][0]['adminName1'] + ',' + x
            except:
                add = x
            better_city.append(add)
            #http://api.geonames.org/searchJSON?q=Beni+Democratic+Republic+of+the+Congo&featureClass=A&username=jiedian233


        for x in better_city:
            if x not in L and x is not location['country']:
                L = L + x + ';'
        L = re.split(";$",L)[0]
        print('L:' + L)
        location['city'] = L
        one_event['location'] = location
        #aff
        print('number-affeted:' + str(affected))
        one_event['number-affected'] = str(affected)

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

    min = t.split(' ')[0].strip('(').strip(')')
    if int(min) < 10:
        min = '0' + min
    data = data + '-' + min + 'Txx:xx:xx'

    return data
def check_date(date_line):
    date_line_format = re.compile('^([^ ]*) to (.*)$')
    date_format = re.compile(r'^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)')
    dateTime1 = date_line_format.search(date_line).group(1)
    dateTime2 = date_line_format.search(date_line).group(2)
    date1_group = date_format.search(dateTime1)
    date2_group = date_format.search(dateTime2)

    # print(dateTime1)

    # print(dateTime2)

    # YEAR1 > YEAR2

    year1 = date1_group.group(0)
    year2 = date2_group.group(0)

    if year1 > year2:
        return False
    if year1 < year2:
        return True

    # MONTH1 > MONTH2

    month1 = date1_group.group(1)
    month2 = date2_group.group(1)

    if month1 > month2:
        return False

    if month1 < month2:
        return True

    # DAY > DAY2

    day1 = date1_group.group(2)
    day2 = date2_group.group(2)

    if day1 > day2:
        return False

    if day1 < day2:
        return True

    # HOUR1 > HOUR2
    hour1 = date1_group.group(3)
    hour2 = date2_group.group(3)
    if hour1 > hour2:
        return False
    if hour1 < hour2:
        return True

    # MIN1 >MIN2

    min1 = date1_group.group(4)
    min2 = date2_group.group(4)

    if min1 > min2:
        return False
    if min1 < min2:
        return True

    # SEC1 >SEC2
    sec1 = date1_group.group(5)
    sec2 = date2_group.group(5)
    if sec1 > sec2:
        return False
    if sec1 < sec2:
        return True

    return True


# swap disordered dates
# input data of format:
# ^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx) to (\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$

def swap_date(date_line):
    date_line_format = re.compile('^([^ ]*) to (.*)$')
    dateTime1 = date_line_format.search(date_line).group(1)
    dateTime2 = date_line_format.search(date_line).group(2)
    correct_date = dateTime2 + " to " + dateTime1
    return correct_date


# two dates are of format
# ^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)
# check date 1 is before date2

def is_before(date1, date2):
    date_line = date1 + " to " + date2
    return check_date(date_line)


# two dates are of format, respective
# date of publication:^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$
# start date:^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)$

def align_date(pub_date, date_line):
    date_format = re.compile(r'^(\d{4})-(\d\d|xx)-(\d\d|xx)T(\d\d|xx):(\d\d|xx):(\d\d|xx)')
    date_line_group = date_format.search(date_line)
    pub_date_group = date_format.search(pub_date)
    year = pub_date_group.group(1)
    month = pub_date_group.group(2)
    day = pub_date_group.group(3)
    hour = pub_date_group.group(4)
    minute = pub_date_group.group(5)
    second = pub_date_group.group(6)
    if month == 'xx':
        month = date_line_group.group(2)
    if day == 'xx':
        day = date_line_group.group(3)
    if hour == 'xx':
        hour = date_line_group.group(4)
    if minute == 'xx':
        minute = date_line_group.group(5)
    if second == 'xx':
        second = date_line_group.group(6)
    final_date = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second
    return final_date