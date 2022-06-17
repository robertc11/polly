import { runner } from "../../../lib/database/dbbulletins"
import { sessionOptions } from "../../../lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req,res){
    if(req.method === "POST"){
        const usr = req.session.user

        if(!usr || usr.isLoggedIn === false) {
            res.status(401).end();
            console.log("> createpost.js: ERROR: User not logged in!")
            return
        }


        const {upvotes, downvotes, statement, map, mapLink, city, timestamp, body, anonymous} = await req.body
        console.log('> createPost.js: Recieved Info:',upvotes, downvotes, statement, map, mapLink, city, timestamp, body, anonymous, usr)

        try{
            if(statement.trim()===''||body.trim()===''){
                throw "Please fill in all fields!"
            }
            
            const resdb = await runner('createBulletin', [ upvotes, downvotes, statement, map, mapLink, city, timestamp, body, anonymous, usr ])
            
            if(!resdb.success){
                throw resdb.msg
            }

            res.status(200).json({ success: true })
        }catch(err){
            console.log('> createpost.js: ERR:',err)
            res.status(400).json({success: false, msg: err})
        }
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}