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


        const {bulletinpostID, comment, author, timestamp} = await req.body
        logger.info(['> addcomment.js: Recieved Info:',bulletinpostID, comment, author, timestamp])

        try{
            if(comment.trim() === ''){
                throw "Cannot submit an empty comment!"
            }
            
            const resdb = await runner('addComment', [bulletinpostID, comment, author.authorID, author.authorName, timestamp])
            logger.info(['> addcomment.js', JSON.stringify(resdb)])
            
            if(!resdb.success){
                throw resdb.msg
            }

            res.status(200).json({ success: true, commentID: resdb.commentID, })
        }catch(err){
            logger.error(['> createpost.js: ERR:',err.name, err.message, err.cause])
            res.status(400).json({success: false, msg: err})
        }
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}