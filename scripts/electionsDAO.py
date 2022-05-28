from pymongo import MongoClient

client = MongoClient('localhost', 27017)

def insertDocuments(arr):
    db = client.events
    collection = db.elections

    # check for similarity/existence in the db - no duplicates

    toObj = []
    for item in arr:
        doc = {
            'name':item[0],
            'electionDay':item[1],
            'cityID':item[2],
            'links':item[3]
        }
        toObj.append(doc)
    
    result = collection.insert_many(toObj)
    


