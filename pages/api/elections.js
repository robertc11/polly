// template file - refer to bulletin.js
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { runner as eventsRunner } from "../../lib/database/dbevents"
import { runner as usersRunner } from "../../lib/database/dbusers"
import { getVoterInfo } from "../../lib/civic";
var stringSimilarity = require("string-similarity")
import { getCurrentUnix } from "../../lib/timestamp";

export default withIronSessionApiRoute(electionsRoute, sessionOptions)

async function electionsRoute(req,res){
    const user = req.session.user

    if(!user || user.isLoggedIn === false) {
        res.status(401).end();
        console.log("> elections.js: ERROR - user not logged in!")
        return;
    }

    const { 
        query: { country, state, county, city },
    } = await req

    try{
        const id = [country, state, county, city]
        console.log(id, user.cityID)
        var eventsData = await eventsRunner('getElections', [id, getCurrentUnix()])
        console.log(eventsData)
        var userData = await usersRunner('getAddress', [user.uid])
        var civicData = null
        if(userData.success){
            console.log('> elections.js: Address String', userData.address+' '+user.cityID[3]+' '+user.cityID[1])
            civicData = await getVoterInfo(userData.address+' '+user.cityID[3]+' '+user.cityID[1])
            console.log('this is civicdata!', civicData)
        }
        
        if(civicData === null || civicData.error|| civicData.notFound){
            // there is no civic data
            if(eventsData.resdb.length > 0){
                res.status(200).json(eventsData.resdb)
            }else{
                throw "No data was found!"
            }
        }else{
            // there is civic data
            var civicArr = [civicData.election].concat(civicData.otherElections || [])
            if(eventsData.resdb.length > 0){
                var merged = mergeData(eventsData.resdb, civicArr)
                res.status(200).json(merged)
            }else{
                res.status(200).json(civicArr)
            }
        }
    }catch(err){
        console.log("> elections.js: ERROR", err)
        res.status(500).json({message:err})
    }
}

function mergeData(a,b){
    var combined = a.concat(b)
    combined.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)  // sort by name in asc order
    console.log('this is combined!',combined)

    var lp = 1
    for(var rp=1; rp < combined.length; rp++){
        if(stringSimilarity.compareTwoStrings(combined[rp].name.toLowerCase(),combined[rp-1].name.toLowerCase()) < 0.8){
            combined[lp] = combined[rp]
            lp++
        }
    }

    return combined.slice(0,lp)
}
