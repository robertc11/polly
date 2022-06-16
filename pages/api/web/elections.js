// template file - refer to bulletin.js
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { runner as eventsRunner } from "../../../lib/database/dbevents"
import { runner as usersRunner } from "../../../lib/database/dbusers"
import { getVoterInfo } from "../../../lib/civic";
var stringSimilarity = require("string-similarity")
import { getCurrentUnix } from "../../../lib/timestamp";
import { verify } from "jsonwebtoken";

const authJWT = (fn) => async (req, res) => {
    const user = req.session.user
    if(!user || user.isLoggedIn === false){
        verify(req.headers.authorization, '0c24670c-a9f6-4acb-a509-49f6136b71b6', async function(err, decoded){
            if(!err && decoded){
                // user is not logged into webapp but has a valid jwt
                return await fn(req,res)
            }
            // user is not logged into webapp and does not have a valid jwt
            res.status(500).json({ message: "Authentication Failed - Access to resource denied" })
        })
    }else{
        // user is logged into the webapp
        return await fn(req, res)
    }
}

export default withIronSessionApiRoute(authJWT(async function electionsRoute(req,res){
    if(req.method === "GET"){
        const user = req.session?.user || null

        const { 
            query: { uid, country, state, county, city },
        } = await req

        try{
            const id = [country, state, county, city]
            console.log(id)
            var eventsData = await eventsRunner('getElections', [id, getCurrentUnix()])
            console.log(eventsData)
            var userData = await usersRunner('getAddress', [ user ? user.uid : uid ])
            var civicData = null
            if(userData.success){
                console.log('> elections.js: Address String', userData.address+' '+id[3]+' '+id[1])
                civicData = await getVoterInfo(userData.address+' '+id[3]+' '+id[1])
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
    }else{
        res.status(405).json({ message: "GET Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}), sessionOptions)

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
