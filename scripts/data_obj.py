from dateutil import parser
import datetime

ERROR_CODE = 1
SUCCESS_CODE = 2

def formatDate(date):
    if not isinstance(date,str):
        return [1, "formatDate: Expected input of type string!"]
    try:
        res = parser.parse(date)  # of type datetime
        res = res.date()
        return [2, res.strftime("%Y-%m-%d")]
    except:
        return [1, 'formatDate: Error parsing string!']

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

        parseRes = parseCityID(["USA",state,county,city])
        self.cityID = parseRes[1] if parseRes[0] == SUCCESS_CODE else None  # currently hardcode to USA
        
    def setElectionName(self, newName):
        self.electionName = newName
    
    def setElectionDay(self, newDate):
        self.electionDay = formatDate(newDate)
    
    def addLink(self, newLink):
        self.links.append(newLink)

    def setElectionCityID(self, newState, newCounty, newCity):
        self.cityID = ["USA", newState, newCounty, newCity]

    def getElectionName(self):
        return self.electionName
    
    def getElectionDay(self):
        return self.electionDay

    def getElectionLinks(self):
        return self.links
    
    def getElectionCityID(self):
        return self.cityID

    def printElection(self):
        print('This Election:',self.electionName,self.electionDay,self.cityID,self.links)

