from bs4 import BeautifulSoup
import requests
from data_obj import Election

def indexOfSplit(arr):
    for i in range(len(arr)):
        if arr[i].isnumeric():
            return i+1
    return -1

def readElections():
    allElections = []

    url = 'https://www.collincountytx.gov/elections/election_information/Pages/default.aspx'
    staticPage = requests.get(url)
    soup = BeautifulSoup(staticPage.content,'lxml')
    anchor = soup.find(string='Current Elections').parent.parent.parent
    allCurrElectionsWrapper = anchor.find_next_sibling('div')
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
        index = indexOfSplit(tmp)
        dateSection = ' '.join(tmp[:index])
        titleSection = ' '.join(tmp[index:])
        thisElection = Election(titleSection, dateSection, "TX", "Collin", links=[url])
        allElections.append(thisElection)
    return allElections

def main():
    data = readElections()
    for election in data:
        election.printElection()

if __name__ == '__main__':
    main()
        
    
    