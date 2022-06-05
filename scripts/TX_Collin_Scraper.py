from bs4 import BeautifulSoup
import requests
from data_obj import Election
from electionsDAO import insertDocuments

# indexOfSplit function to find the index of a list delimiting date from name
# params: arr - List
def indexOfSplit(arr):
    for i in range(len(arr)):
        if arr[i].isnumeric():
            return i+1
    return -1

# readElections function to gather all elections on the collin county election page
# returns a list of all found elections
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

# readUpcomingElections function to get all elections on the collin county upcoming election page
# returns a list of all found upcoming elections
def readUpcomingElections():
    allElections = []

    url = 'https://www.collincountytx.gov/elections/election_information/Pages/upcoming.aspx'
    staticPage = requests.get(url)
    soup = BeautifulSoup(staticPage.content,'lxml')
    anchor = soup.find(id="pageTitle")
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

# main function - runner
def main():
    # sort in alphabetical order
    data = sorted(readElections() + readUpcomingElections(), key=lambda x: x.getElectionName(), reverse=False) 
    for election in data:
        election.printElection()
    insertDocuments(data)

if __name__ == '__main__':
    main()
        
    
    