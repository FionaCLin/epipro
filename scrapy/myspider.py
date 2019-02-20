import scrapy

'''
Search Keywords(REGEX)
Specific Search Term                      General Search Term
Zika                                      Outbreak
MERS                                      Infection
Salmonella                                Fever
Legionnaire                               Virus
Measles                                   Epidemic
Category A Agents:                        Infectious
Anthrax                                   Illness
Botulism                                  Bacteria
Plague                                    Emerging
Smallpox and other related pox viruses    Unknown virus
Tularemia                                 Myster(ious)y disease
Junin Fever
Machupo Fever
Guanarito Fever
Chapare Fever
Lassa Fever
Lujo Fever
Hantavirus
Rift Valley Fever
Crimean Congo Hemorrhagic Fever
Dengue
Ebola
Marburg
'''
# '''
# Besides the getall() and get() methods, you can also use # the re() method to extract using regular expressions:
#
# >>> response.css('title::text').re(r'Quotes.*')
# ['Quotes to Scrape']
# >>> response.css('title::text').re(r'Q\w+')
# ['Quotes']
# >>> response.css('title::text').re(r'(\w+) to (\w+)')
# ['Quotes', 'Scrape']
# '''
## fetch the page and filter the keywords and regex
class BlogSpider(scrapy.Spider):
    name = 'blogspider'
    start_urls = ['https://www.who.int/csr/don/archive/year/2019/en/']

    def parse(self, response):
        print('='*50)
        ul = response.css('ul.auto_archive')[0]

        j = 1
        for i in ul.css('li span.link_info::text').getall():
            print(j, i)
            print('@'*50)
            j+=1
        print('='*50)

        # for next_page in response.css('div.prev-post > a'):
        #     yield response.follow(next_page, self.parse)
