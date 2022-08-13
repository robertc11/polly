// template file - refer to bulletin.js
import { runner as eventsRunner } from "../../../lib/database/dbevents"
import { runner as usersRunner } from "../../../lib/database/dbusers"
import { getVoterInfo } from "../../../lib/civic";
var stringSimilarity = require("string-similarity")
import { getCurrentUnix } from "../../../lib/timestamp";
import { getSessionSsr } from "../../../lib/redis-auth/wrappers";
import logger from '../../../logger/logger'

export default async function electionsRoute(req,res){
    if(req.method === "GET"){
        var user = await getSessionSsr(req)

        if(!user){
            res.status(401).end();
            logger.error("> getpost.js: ERROR: User not logged in!")
            return;
        }

        const { 
            query: { country, state, county, city },
        } = await req

        try{
            const id = [country, state, county, city]
            logger.info([JSON.stringify(id, user.uid)])
            var eventsData = await eventsRunner('getElections', [id, getCurrentUnix()])
            logger.info([eventsData])
            var userData = await usersRunner('getAddress', [ user.uid ])
            var civicData = null
            if(userData.success){
                logger.info(['> elections.js: Address String', userData.address+' '+id[3]+' '+id[1]])
                civicData = await getVoterInfo(userData.address+' '+id[3]+' '+id[1])
                logger.info(['this is civicdata!', JSON.stringify(civicData)])
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
            logger.error(["> elections.js: ERROR", JSON.stringify(err)])
            res.status(500).json({message:err})
        }
    }else{
        res.status(405).json({ message: "GET Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}

function mergeData(a,b){
    var combined = a.concat(b)
    combined.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1)  // sort by name in asc order
    logger.info(['this is combined!',combined])

    var lp = 1
    for(var rp=1; rp < combined.length; rp++){
        if(stringSimilarity.compareTwoStrings(combined[rp].name.toLowerCase(),combined[rp-1].name.toLowerCase()) < 0.8){
            combined[lp] = combined[rp]
            lp++
        }
    }

    return combined.slice(0,lp)
}
