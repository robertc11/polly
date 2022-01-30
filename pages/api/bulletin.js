import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

export default withIronSessionApiRoute(bulletinRoute, sessionOptions)

async function bulletinRoute(req,res){
    const user = req.session.user
    console.log("USER'S CITY", user.cityID[3])

    if(!user || user.isLoggedIn === false) {
        res.status(401).end();
        console.log("ERRROR")
        return;
    }

    try{
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        console.log('bulletin.js: connected to database!')

        // perform db search here
        const bulletinDatabase = client.db('bulletin')
        const data = await bulletinDatabase.collection('bulletinposts').aggregate([
            { $match:
                {
                    city: user.cityID[3],
                }
            }, { $lookup: 
                {
                    from: 'bulletincomments',
                    localField: 'uniqueID',
                    foreignField: 'bulletinpostID',
                    as: 'comments',
                }
            }
        ]).toArray()
                
        res.json(data)
    }catch(err){
        console.log("SHIT")
        res.status(200).json([])
    }finally{
        await client.close()
        console.log('MONGODB Connection CLOSED')
    }

}
