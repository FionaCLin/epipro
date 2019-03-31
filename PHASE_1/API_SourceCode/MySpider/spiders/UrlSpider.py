from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from scrapy.selector import Selector
import time
import os

###### this python may used to get location_id
def writeFile(dirPath, page):
    data = Selector(text = page).xpath("//td[@class='zwmc']/div/a")
    titles = data.xpath('string(.)').extract()
    timeMarks = Selector(text = browser.page_source).xpath("//td[@class='gxsj']/span/text()").extract()
    links = Selector(text = browser.page_source).xpath("//td[@class='zwmc']/div/a/@href").extract()


    for i in range(len(titles)):
        fileName = titles[i].replace(':', '-').replace('/', '-').replace('\\', '-').replace('*', 'x').replace('|', '-').replace('?', '-').replace('<', '-').replace('>', '-').replace('"', '-').replace('\n', '-').replace('\t', '-')
        filePath = dirPath + os.sep + fileName + '.txt'


        with open(filePath, 'w') as fp:
            fp.write(titles[i])
            fp.write('$***$')
            fp.write(timeMarks[i])
            fp.write('$***$')
            fp.write(links[i])




def searchFunction(browser, url, keyWord, dirPath):
    browser.get(url)
    #Just for test

    #find the searh bar and the search
    searchbox = browser.find_element_by_id('inputFieldMain')
    searchbox.send_keys(keyWord)
    browser.find_element_by_id('searchButtonMain').click()
    time.sleep(4)

    #find html file
    x = browser.find_element_by_xpath("//div[@id = 'facet-filter-container-4']//span[@class = 'facet-child-container'][1]//p")
    x.click()
    time.sleep(3)

    for page in range(3):
        print('     ' + 'page ' + str(page+1))
        for counter in range(10):
            #print(counter)
            title = Selector(text = browser.page_source).xpath("//a[@class = 'result-title']/text()").extract()[counter]
            url = Selector(text = browser.page_source).xpath("//span[@class = 'result-url']/text()").extract()[counter]
            print('     '+title + '   ' + url)

        browser.find_element_by_link_text('Next »').click()
        time.sleep(2)


    time.sleep(3)



if __name__ == '__main__':
    print ("Url spier")
    url = 'https://www.who.int/search'
    keyWord = ['Outbreak','Infection','Fever']
    dirPath = 'x'


#use chrome
    browser = webdriver.Chrome()
    for word in keyWord:
        print(word + ":")
        searchFunction(browser, url, word, dirPath)
    #browser.close()
    print("end")
