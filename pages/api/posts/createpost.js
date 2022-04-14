import { createBulletin } from "../../../lib/database/dbbulletins"
import { sessionOptions } from "../../../lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req,res){
    const usr = req.session.user

    if(!usr || usr.isLoggedIn === false) {
        res.status(401).end();
        console.log("> createpost.js: ERROR: User not logged in!")
        return
    }


    const {upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user} = await req.body
    console.log('> createPost.js: Recieved Info:',upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user)
    try{
        const resdb = await createBulletin(upvotes, downvotes, statement, map, mapLink, city, timestamp, body, user)
        
        if(!resdb.success){
            throw resdb.msg
        }

        res.status(200).json({ success: true })
    }catch(err){
        console.log('> createpost.js: ERR:',err)
        res.status(500).json({success: false, msg: err})
    }
}