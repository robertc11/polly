from pymongo import MongoClient
from difflib import SequenceMatcher

client = MongoClient('localhost', 27017)

def checkDup(electionObj, dbData):
    for row in dbData:
        s = SequenceMatcher(lambda x: x == ' ', row['name'], electionObj.getElectionName())
        delta = round(s.ratio(),3)
        if delta > 0.6:
            return True
    return False

def insertDocuments(arr):
    db = client.events
    collection = db.elections

    currEntries = db.find({"cityID": arr[0].getElectionCityID()}) # array of all the current elections matching the location

    toObj = []
    for item in arr:
        # check for similarity/existence in the db - no duplicates
        if checkDup(item, currEntries):
            continue

        doc = {
            'name':item[0],
            'electionDay':item[1],
            'cityID':item[2],
            'links':item[3]
        }
        toObj.append(doc)
    
    result = collection.insert_many(toObj)



