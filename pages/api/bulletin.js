import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { getBulletins } from '../../lib/database/dbbulletins'

export default withIronSessionApiRoute(bulletinRoute, sessionOptions)

async function bulletinRoute(req,res){
    const user = req.session.user
    

    if(!user || user.isLoggedIn === false) {
        res.status(401).end();
        console.log("ERRROR")
        return;
    }
    
    console.log("USER'S CITY", user.cityID[3])
    console.log("USER'S ID", user.uid)

    try{
        const data = await getBulletins(user.cityID, user.uid)
        if(data.error){
            throw "An error occurred while retrieving the data"
        }
        res.json(data.resdb)
    }catch(err){
        console.log("FUCKING SHITTTER",err)
        res.status(500).json({message:err})
    }

}
