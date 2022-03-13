import { createBulletin } from "../../lib/database/dbbulletins"

export default async function handler(req,res){
    const {upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user} = await req.body
    console.log('this is what came thru!',upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user)
    try{
        const resdb = await createBulletin(upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user)
        
        if(!resdb.success){
            throw resdb.msg
        }

        res.status(200).json({ success: true })
    }catch(err){
        res.status(500).json({success: false, msg: "a database error occured!"})
    }
}