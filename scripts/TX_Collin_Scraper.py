from bs4 import BeautifulSoup
import requests
from data_obj import election

def indexOfSplit(arr):
    for i in range(len(arr)):
        if arr[i].isnumeric():
            return i+1
    return -1

url = 'https://www.collincountytx.gov/elections/election_information/Pages/default.aspx'
staticPage = requests.get(url)
soup = BeautifulSoup(staticPage.content,'lxml')

#print(soup.prettify())
anchor = soup.find(string='Current Elections').parent.parent.parent
#print(anchor)
allCurrElectionsWrapper = anchor.find_next_sibling('div')
print(allCurrElectionsWrapper)
for electionNames in allCurrElectionsWrapper.find_all("strong"):
    rawStr = electionNames.text
    res = ''
    for char in rawStr:
        if char.isascii():
            res += char
        else:
            res += ' '
    if res.strip() == '':
        continue
    tmp = res.split(' ')
    # print(tmp)
    index = indexOfSplit(tmp)
    dateSection = ' '.join(tmp[:index])
    titleSection = ' '.join(tmp[index:])
    # print(dateSection)
    # print(titleSection)
    thisElection = election(titleSection, dateSection, "TX", "Collin", link=url)
    thisElection.printElection()
        
    
    