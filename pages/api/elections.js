// --- FILE NOT IN USE AND MARKED FOR DELETION ---

// // template file - refer to bulletin.js
// import { withIronSessionApiRoute } from "iron-session/next";
// import { sessionOptions } from "../../lib/session";
// const { MongoClient } = require('mongodb')
// const url = process.env.MONGO_URL
// const client = new MongoClient(url)

// export default withIronSessionApiRoute(electionsRoute, sessionOptions)

// async function electionsRoute(req,res){
//     const user = req.session.user
//     console.log("> elections.js: USER'S CITYID:", user.cityID)
//     const queryCity = {"cityID": user.cityID}
//     const queryCounty = {"cityID": [user.cityID[0], user.cityID[1], user.cityID[2], null]}
//     const queryState = {"cityID": [user.cityID[0], user.cityID[1], null, null]}
//     const queryCountry = {"cityID": [user.cityID[0], null, null, null]}

//     if(!user || user.isLoggedIn === false) {
//         res.status(401).end();
//         console.log("> elections.js: ERROR")
//         return;
//     }

//     try{
//         await client.connect()
//         await client.db("admin").command({ ping: 1 })
//         console.log('> elections.js: connected to database!')

//         // perform db search here
//         const bulletinDatabase = client.db('events')
//         const dataCity = await bulletinDatabase.collection('elections').find(queryCity).sort({"timestamps.target": 1}).limit(6).toArray()
//         const dataCounty = await bulletinDatabase.collection('elections').find(queryCounty).sort({"timestamps.target": 1}).limit(6).toArray()
//         const dataState = await bulletinDatabase.collection('elections').find(queryState).sort({"timestamps.target": 1}).limit(6).toArray()
//         const dataCountry = await bulletinDatabase.collection('elections').find(queryCountry).sort({"timestamps.target": 1}).limit(6).toArray()
        
//         const data = {
//             city: dataCity,
//             county: dataCounty,
//             state: dataState,
//             country: dataCountry,
//         }

//         res.json(data)
//     }catch(err){
//         console.log("> elections.js: ERROR")
//         res.status(500).json({message:err})
//     }finally{
//         await client.close()
//         console.log('> elections.js: MONGODB Connection CLOSED')
//     }

// }
