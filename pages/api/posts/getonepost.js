import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { runner } from '../../../lib/database/dbbulletins'

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req,res){
    const user = req.session.user

    const {
        query: { obj_id },
    } = req
    
    if(!user || user.isLoggedIn === false) {
        res.status(401).end();
        console.log("> getpost.js: ERROR: User not logged in!")
        return;
    }

    console.log("> getonepost.js: QUERY PARAMS:", obj_id)


    try{
        const data = await runner('getOneBulletin',[ obj_id ])
        console.log(data)
        if(!data.success){
            throw "An error occurred while retrieving the data"
        }
        res.json(data)
    }catch(err){
        console.log("> getonepost.js: ERROR:",err)
        res.status(500).json({success:false, message:err})
    }

}
