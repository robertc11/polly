import { runner } from "../../../lib/database/dbbulletins"
import { sessionOptions } from "../../../lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req,res){
    if(req.method === "POST"){
        const user = req.session.user

        if(!user || user.isLoggedIn === false) {
            res.status(401).end();
            console.log("> editvote.js: ERROR: User not logged in!")
            return
        }

        
        const { upDelta, downDelta, upvoteSelected, downvoteSelected, postid, uid } = await req.body
        console.log('> editvote.js: Incoming Params:',postid,uid,upDelta,downDelta,upvoteSelected,downvoteSelected)

        var chosenVote = ""
        if(upvoteSelected){
            chosenVote = "upvote"
        }else if(downvoteSelected){
            chosenVote = "downvote"
        }else{
            chosenVote = "neither"
        }

        try{
            const resdb = await runner('setVotes', [ postid,uid,chosenVote,upDelta,downDelta ])
            console.log('> editvote.js',resdb.success)
            if(!resdb.success){
                throw "database error!"
            }
            res.status(200).json({success:true})
        }catch(err){
            console.error(err)
            res.status(500).json({success:false})
        }
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
    
}