const { MongoClient, ObjectId } = require('mongodb')
const url = process.env.MONGO_URL

export async function runner(funcName, options){
    const client = new MongoClient(url)

    try{
        await client.connect()

        var data = null
        switch(funcName){
            case 'getElections':
                data = await getElections(client, ...options)
                break
            default:
                throw "undefined function call"
        }

        if(!data){
            throw 'No information was returned'
        }

        return data

    }catch(err){
        console.log('> dbbulletins.js/runner: An unexpected error occurred', err)
        return {
            success: false,
            error: err,
        }
    }finally{
        await client.close()
    }
}

async function getElections(client, cityID){
    const cityDoc = { cityID: cityID }
    const countyDoc = { cityID: [cityID[0], cityID[1], cityID[2], null] }
    const stateDoc = { cityID: [cityID[0], cityID[1], null, null] }
    const countryDoc = { cityID: [cityID[0], null, null, null] }

    try{
        const eventsDatabase = client.db('events')

        var cityData = await eventsDatabase.collection('elections').find(cityDoc).toArray()
        var countyData = await eventsDatabase.collection('elections').find(countyDoc).toArray()
        var stateData = await eventsDatabase.collection('elections').find(stateDoc).toArray()
        var countryData = await eventsDatabase.collection('elections').find(countryDoc).toArray()

        var allData = cityData.concat(countyData).concat(stateData).concat(countryData)

        return {
            success: true,
            resdb: allData, 
        }
    }catch(err){
        console.log('> dbevents.js/getElections: ERROR', err)
        return {
            success: false,
            resdb: null,
        }
    }
}