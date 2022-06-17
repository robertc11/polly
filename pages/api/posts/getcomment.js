import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../../lib/session";
import { runner } from '../../../lib/database/dbbulletins'

export default withIronSessionApiRoute(bulletinRoute, sessionOptions)

async function bulletinRoute(req,res){
    if(req.method === "GET"){
        const user = req.session.user
        
        const {
            query: { post, per_page, obj_id },
        } = req
        

        if(!user || user.isLoggedIn === false) {
            res.status(401).end();
            console.log("> getpost.js: ERROR: User not logged in!")
            return;
        }
        
        console.log("> getcomment.js: QUERY PARAMS:", post, per_page, obj_id)
        // console.log("> getpost.js: User's City:", user.cityID[3])
        // console.log("> getpost.js: User's ID:", user.uid)

        try{
            const data = await runner('getComments',[ post, parseInt(per_page), obj_id ])
            if(data.error){
                throw "An error occurred while retrieving the data"
            }
            res.json(data.resdb)
        }catch(err){
            console.log("> getcomment.js: ERROR:",err)
            res.status(500).json({message:err})
        }
    }else{
        res.status(405).json({ message: "GET Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}