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


        const {bulletinpostID, comment, author, timestamp} = await req.body
        console.log('> addcomment.js: Recieved Info:',bulletinpostID, comment, author, timestamp)

        try{
            if(comment.trim() === ''){
                throw "Cannot submit an empty comment!"
            }
            
            const resdb = await runner('addComment', [bulletinpostID, comment, author.authorID, author.authorName, timestamp])
            console.log('> addcomment.js', resdb)
            
            if(!resdb.success){
                throw resdb.msg
            }

            res.status(200).json({ success: true, commentID: resdb.commentID, })
        }catch(err){
            console.log('> createpost.js: ERR:',err)
            res.status(400).json({success: false, msg: err})
        }
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}