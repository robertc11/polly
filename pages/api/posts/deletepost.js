import { runner } from "../../../lib/database/dbbulletins"
import { sessionOptions } from "../../../lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req,res){
    const user = req.session.user

    if(!user || user.isLoggedIn === false) {
        res.status(401).end();
        console.log("> deletepost.js: ERROR: User not logged in!")
        return
    }
    
    const { postID } = await req.body
    console.log('> deletepost.js:',postID)

    try{
        const resdb = await runner('removeBulletin', [ postID ])
        
        if(!resdb.success){
            throw resdb.msg
        }

        res.status(200).json({ success: true })
    }catch(err){
        res.status(500).json({success: false, msg: err})
    }
}