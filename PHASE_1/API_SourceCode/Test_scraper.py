import pymongo
from pymongo import MongoClient
import json
import config
# for testing
# usage:
# To get report
# >scrapy crawl contentSpider
# To get url : (Make sure the urlspide.json file is not exist)
# >scrapy crawl urlSpider -o urlSpider.json -s FEED_EXPORT_ENCODING=UTF-8
#
# run test:
# python scraper_test.py
client = MongoClient(config.MONGO_URI, config.PORT)
db = client[config.MONGO_DB]
collection = db['reports']
test_list = [
    'https://www.who.int/csr/don/06-june-2018-ebola-drc/en/',
    'https://www.who.int/csr/don/29-march-2018-cholera-somalia/en/',
    'https://www.who.int/csr/don/20-april-2018-lassa-fever-nigeria/en/'
]

'''
1.
Since the last Disease Outbreak News on 30 May 2018, two '
              'additional cases have been laboratory confirmed for Ebola virus '
              'disease (EVD) in the Democratic Republic of the Congo; both '
              'cases were reported from Iboko Health Zone. Recently available '
              'information has enabled the classification of some cases to be '
              'updated).
2.
The ongoing cholera outbreak in Somalia started in December '
              '2017. As of 18 March 2018, a total of 1613 cholera cases, '
              'including nine deaths (case fatality rate = 0.6%), have been '
              'reported from four regions: Hiraan, Banadir, Lower Juba and '
              'Middle Shabelle.  Vibrio cholerae The outbreak started in '
              'Beletweyne, Hiraan Region; it spread to Banadir Region in early '
              'January 2018, to Lower Juba in early February 2018, and to '
              'Middle Shabelle in early February 2018. Of the 66 stool samples '
              'tested in 2018, 19 were positive for '
3.
'From 1 January through 15 April 2018, 1849 suspected cases have '
              'been reported from 21 states (Abia, Adamawa, Anambra, Bauchi, '
              'Benue, Delta, Ebonyi, Edo, Ekiti, Federal Capital Territory, '
              'Gombe, Imo, Kaduna, Kogi, Lagos, Nasarawa, Ondo, Osun, Plateau, '
              'Rivers, and Taraba). Of these, 413 patients were confirmed with '
              'Lassa fever, nine were classified as probable 1422 tested '
              'negative and were classified as non-cases and for the five '
              'remaining suspect cases laboratory results are pending. Among '
              'the 413 confirmed and the nine probable Lassa fever cases, 114 '
              'deaths were reported (case fatality rate for confirmed cases is '
              '25.4% and for confirmed and probable cases combined is 27%).'

'''


def test_format():
    counter = 0
    for test in collection.find():
        # test format
        if counter == 5:
            break
        assert True == isinstance(test['url'], str)
        assert True == isinstance(test['date_of_publication'], str)
        assert True == isinstance(test['headline'], str)
        assert True == isinstance(test['main_text'], str)
        assert True == isinstance(test['reports'], list)
        assert True == isinstance(test['reports'][0]['disease'], list)
        print(type(test['reports'][0]['syndrome']), test['reports'][0]['syndrome'])
        assert True == isinstance(test['reports'][0]['syndrome'], list)
        assert True == isinstance(test['reports'][0]['reported_events'], list)
        assert True == isinstance(
            test['reports'][0]['reported_events'][0]['type'], str)
        assert True == isinstance(
            test['reports'][0]['reported_events'][0]['date'], str)
        assert True == isinstance(
            test['reports'][0]['reported_events'][0]['location'], dict)
        assert True == isinstance(
            test['reports'][0]['reported_events'][0]['location']['country'], str)
        assert True == isinstance(
            test['reports'][0]['reported_events'][0]['location']['location'], str)
        assert True == isinstance(
            test['reports'][0]['reported_events'][0]['number-affected'], int)
        # print(test)

        counter = counter + 1
    print('Passed test scraper generated format')


def test_data_extraction():
    counter = 0
    for url in test_list:
        test = collection.find({'url': url})
        for x in test:
            if counter == 0:
                assert 'ebola' in x['reports'][0]['disease']
                assert '2018-05-30Txx:xx:xx' in x['reports'][0]['reported_events'][0]['date']
                assert '2' in x['reports'][0]['reported_events'][0]['number-affected']
            if counter == 1:
                assert 'cholera' in x['reports'][0]['disease']
                assert '2018-03-18Txx:xx:xx' in x['reports'][0]['reported_events'][0]['date']
                assert 'Beletweyne' in x['reports'][0]['reported_events'][0]['location']['location']
            if counter == 2:
                assert 'lassa fever' in x['reports'][0]['disease']
                assert '2018-01-01Txx:xx:xx' in x['reports'][0]['reported_events'][0]['date']
                assert '1849' in x['reports'][0]['reported_events'][0]['number-affected']
        counter = counter + 1

    print('Pass test scraper data extraction')


if __name__ == '__main__':

    print('## test scraper generated format')
    test_format()
    print('## test scraper data extraction')
    test_data_extraction()

    #self.collection_2.find({"$text": {"$search": words[0]}})
    # testing format
