from dateutil import parser
import datetime
import time

ERROR_CODE = 1
SUCCESS_CODE = 2

# Function to take in a date string and format it into YYYY-MM-DD
# params: date - string
def formatDate(date):
    if not isinstance(date,str):
        return [1, "formatDate: Expected input of type string!"]
    try:
        resA = parser.parse(date)  # of type datetime
        resB = resA.date()
        return [2, resB.strftime("%Y-%m-%d"), int(resA.timestamp())]
    except:
        return [1, 'formatDate: Error parsing string!']

# parseCityID function to parse a cityID array and return one filled with None in missing places
# params: arr - list
def parseCityID(arr):
    try:
        res = [arr[0],arr[1]]
        for i in range(2,len(arr)):
            if arr[i] is not None:
                res.append(arr[i].capitalize())
            else:
                res.append(None)
        return [2, res]
    except:
        return [1, "parseCityID: failed"]

class Election:
    def __init__(self, name, date, state=None, county=None, city=None, links=[]):
        self.electionName = name
        self.links = links

        dateRes = formatDate(date)  # dates in the form YYYY-MM-DD
        self.electionDay = dateRes[1] if dateRes[0] == SUCCESS_CODE else None
        self.electionUnix = dateRes[2] if dateRes[0] == SUCCESS_CODE else None

        parseRes = parseCityID(["USA",state,county,city])
        self.cityID = parseRes[1] if parseRes[0] == SUCCESS_CODE else None  # currently hardcode to USA
        
    # setElectionName function to set the Election's name
    # params: newName - String
    def setElectionName(self, newName):
        self.electionName = newName
    
    # setElectionDay function to set a new election date
    # params: newDate - String
    def setElectionDay(self, newDate):
        self.electionDay = formatDate(newDate)
    
    # addLink function to add a link to the election object
    # params: newLink - String
    def addLink(self, newLink):
        self.links.append(newLink)

    # setElectionCityID function to set a new cityID
    # params: newState - String of length 2 (state abbreviation), newCounty - String, newCity - String
    def setElectionCityID(self, newState, newCounty, newCity):
        self.cityID = parseCityID(["USA", newState, newCounty, newCity])

    # getElectionName function to get the election name
    def getElectionName(self):
        return self.electionName
    
    # getElectionDay function to get the eleciton's date
    def getElectionDay(self):
        return self.electionDay

    # getElectionLinks function to get all election links
    def getElectionLinks(self):
        return self.links
    
    # getElectionCityID function to get election cityID
    def getElectionCityID(self):
        return self.cityID

    def getElectionUnix(self):
        return self.electionUnix

    # printElection function to print all attributes of Election object
    def printElection(self):
        print('This Election:',self.electionName,self.electionDay,self.cityID,self.links)

