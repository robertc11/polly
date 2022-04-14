import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { getBulletins } from '../../../lib/database/dbbulletins'

export default withIronSessionApiRoute(bulletinRoute, sessionOptions)

async function bulletinRoute(req,res){
    const user = req.session.user
    
    const {
        query: { per_page, page },
    } = req
    

    if(!user || user.isLoggedIn === false) {
        res.status(401).end();
        console.log("> bulletin.js: ERROR: User not logged in!")
        return;
    }
    
    console.log("> bulletin.js: QUERY PARAMS:", per_page, page)
    console.log("> bulletin.js: User's City:", user.cityID[3])
    console.log("> bulletin.js: User's ID:", user.uid)

    try{
        const data = await getBulletins(user.cityID, user.uid, parseInt(per_page), parseInt(page))
        if(data.error){
            throw "An error occurred while retrieving the data"
        }
        res.json(data.resdb)
    }catch(err){
        console.log("> bulletin.js: ERROR:",err)
        res.status(500).json({message:err})
    }

}
