import { runner } from '../../../lib/database/dbbulletins'
import { getSessionSsr } from '../../../lib/redis-auth/wrappers';
import logger from '../../../logger/logger'

export default async function bulletinRoute(req,res){
    if(req.method === "GET"){
        const user = await getSessionSsr(req)
        
        if(!user) {
            res.status(401).end();
            logger.warn("> getpost.js: ERROR: User not logged in!")
            return;
        }
        
        const {
            query: { post, per_page, obj_id },
        } = req
        
        
        logger.info(["> getcomment.js: QUERY PARAMS:", post, per_page, obj_id])
        // console.log("> getpost.js: User's City:", user.cityID[3])
        // console.log("> getpost.js: User's ID:", user.uid)

        try{
            const data = await runner('getComments',[ post, parseInt(per_page), obj_id ])
            if(data.error){
                throw "An error occurred while retrieving the data"
            }
            res.json(data.resdb)
        }catch(err){
            logger.error(["> getcomment.js: ERROR:",err.name, err.message, err.cause])
            res.status(500).json({message:err})
        }
    }else{
        res.status(405).json({ message: "GET Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}