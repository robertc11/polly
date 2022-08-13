import { runner } from "../../../lib/database/dbbulletins"
import { getSessionSsr } from "../../../lib/redis-auth/wrappers";
import logger from '../../../logger/logger'

export default async function handler(req,res){
    if(req.method === "POST"){
        const user = await getSessionSsr(req)
        
        if(!user) {
            res.status(401).end();
            logger.warn("> getpost.js: ERROR: User not logged in!")
            return;
        }

        
        const { upDelta, downDelta, upvoteSelected, downvoteSelected, postid, uid } = await req.body
        logger.info(['> editvote.js: Incoming Params:',postid,uid,upDelta,downDelta,upvoteSelected,downvoteSelected])

        var chosenVote = ""
        if(upvoteSelected){
            chosenVote = "upvote"
        }else if(downvoteSelected){
            chosenVote = "downvote"
        }else{
            chosenVote = "neither"
        }

        try{
            const resdb = await runner('setVotes', [ postid,uid,chosenVote,upDelta,downDelta ])
            logger.info(['> editvote.js',resdb.success])
            if(!resdb.success){
                throw "database error!"
            }
            res.status(200).json({success:true})
        }catch(err){
            logger.error([err.name, err.message, err.cause])
            res.status(500).json({success:false})
        }
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
    
}