from pymongo import MongoClient
from difflib import SequenceMatcher
import time

client = MongoClient('localhost', 27017)

# checkDup function to check if a duplicate election already exists in database
# params: electionObj - Election, dbData - List
def checkDup(electionObj, dbData):
    for row in dbData:
        s = SequenceMatcher(lambda x: x == ' ', row['name'].lower(), electionObj.getElectionName().lower())
        delta = round(s.ratio(),3)
        if delta > 0.8:
            return True
    return False

def removeDup(inputArr):
    arr = sorted(inputArr, key=lambda x: x.getElectionName(), reverse=False) 

    lp = 1
    for rp in range(1,len(arr)):
        s = SequenceMatcher(lambda x: x == ' ', arr[rp].getElectionName().lower(), arr[rp-1].getElectionName().lower())
        delta = round(s.ratio(),3)
        if delta < 0.8:
            arr[lp] = arr[rp]
            lp += 1
    return arr[:lp]

# insertDocuments function to insert elections into the database
# params: arr - List of Elections to be added
def insertDocuments(arr):
    db = client.events
    collection = db.elections

    newArr = removeDup(arr)
    currEntries = collection.find({"cityID": arr[0].getElectionCityID()}) # cursor obj of all the current elections matching the location

    toObj = []
    for item in newArr:
        # check for similarity/existence in the db - no duplicates
        if checkDup(item, currEntries):
            print("Issue with election item - skipped")
            continue

        doc = {
            'name':item.getElectionName(),
            'electionDay':item.getElectionDay(),
            'cityID':item.getElectionCityID(),
            'links':item.getElectionLinks(),
            'timestamp': {
                'creation': int(time.time()),
                'target': item.getElectionUnix(),
            }
        }
        
        toObj.append(doc)
    if len(toObj) > 0:
        result = collection.insert_many(toObj)
        print(result)
    else:
        print("No documents were inserted!")



