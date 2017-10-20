import urllib2
from bs4 import BeautifulSoup

quote_page = ['http://sjdowntown.com/events/','http://sjdowntown.com/music-in-the-park/']
# for loop
data = []
for pg in quote_page:

 page = urllib2.urlopen(pg)
# parse the html using beautiful soap and store in variable 
 soup = BeautifulSoup(page, 'html.parser')
# Take out the <div> of name and get its value
 name_box = soup.find('span', attrs={'class': 'dp_pec_event_title_sp'})

 name = name_box.text # strip() is used to remove starting and trailing
# get the index price
 #price_box = soup.find('div', attrs={'class':'price'})
 #price = price_box.text
# save the data in tuple
 data.append((name))
 print name_box
 print data