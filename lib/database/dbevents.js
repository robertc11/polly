const { ObjectId } = require('mongodb')
import clientPromise from './mongodb'

export async function runner(funcName, options){
    const client = await clientPromise

    try{
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
        //await client.close()
    }
}

async function getElections(client, cityID, afterUnix){
    const cityDoc = { cityID: cityID, "timestamp.target": { $gte: afterUnix} }
    const countyDoc = { cityID: [cityID[0], cityID[1], cityID[2], null], "timestamp.target": { $gte: afterUnix} }
    const stateDoc = { cityID: [cityID[0], cityID[1], null, null], "timestamp.target": { $gte: afterUnix} }
    const countryDoc = { cityID: [cityID[0], null, null, null], "timestamp.target": { $gte: afterUnix} }

    try{
        const eventsDatabase = client.db('events')

        var cityData = await eventsDatabase.collection('elections').find(cityDoc).sort({ "timestamp.target": 1 }).toArray()
        var countyData = await eventsDatabase.collection('elections').find(countyDoc).sort({ "timestamp.target": 1 }).toArray()
        var stateData = await eventsDatabase.collection('elections').find(stateDoc).sort({ "timestamp.target": 1 }).toArray()
        var countryData = await eventsDatabase.collection('elections').find(countryDoc).sort({ "timestamp.target": 1 }).toArray()

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