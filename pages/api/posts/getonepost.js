import { runner } from '../../../lib/database/dbbulletins'
import { getSessionSsr } from '../../../lib/redis-auth/wrappers';
import logger from '../../../logger/logger'

export default async function handler(req,res){
    if(req.method === "GET"){
        const user = await getSessionSsr(req)
        
        if(!user) {
            res.status(401).end();
            logger.info("> getpost.js: ERROR: User not logged in!")
            return;
        }

        const {
            query: { obj_id },
        } = req
        logger.info("> getonepost.js: QUERY PARAMS:", obj_id)


        try{
            const resdb = await runner('getOneBulletin',[ obj_id, user.uid ])
            logger.info(resdb)
            if(!resdb.success){
                throw "An error occurred while retrieving the data"
            }
            res.json({data: resdb.data, success: true})
        }catch(err){
            logger.info("> getonepost.js: ERROR:",err)
            res.status(500).json({success:false, message:err})
        }
    }else{
        res.status(405).json({ message: "GET Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}
