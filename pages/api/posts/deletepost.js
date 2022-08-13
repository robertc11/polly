import { runner } from "../../../lib/database/dbbulletins"
import { getSessionSsr } from "../../../lib/redis-auth/wrappers";
import logger from "../../../logger/logger";

export default async function handler(req,res){
    if(req.method === "POST"){
        const user = await getSessionSsr(req)
        
        if(!user) {
            res.status(401).end();
            logger.warn("> getpost.js: ERROR: User not logged in!")
            return;
        }
        
        const { postID } = await req.body
        logger.info(['> deletepost.js:',postID])

        try{
            const resdb = await runner('removeBulletin', [ postID ])
            
            if(!resdb.success){
                throw resdb.msg
            }

            res.status(200).json({ success: true })
        }catch(err){
            res.status(500).json({success: false, msg: err})
        }
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}