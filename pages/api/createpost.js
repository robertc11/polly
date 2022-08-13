import { createBulletin } from "../../lib/database/dbbulletins"
import logger from '../../logger/logger'

export default async function handler(req,res){
    const {upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user} = await req.body
    logger.info('> createPost.js: Recieved Info:',upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user)
    try{
        const resdb = await createBulletin(upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user)
        
        if(!resdb.success){
            throw resdb.msg
        }

        res.status(200).json({ success: true, bulletin: resdb.bulletin})
    }catch(err){
        logger.error(['> createpost.js: ERR:',err.name, err.message, err.cause])
        res.status(500).json({success: false, msg: err})
    }
}