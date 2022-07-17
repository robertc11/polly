import { runner } from "../../../lib/database/dbbulletins"
import { getSessionSsr } from "../../../lib/redis-auth/wrappers";

export default async function handler(req,res){
    if(req.method === "POST"){
        const user = await getSessionSsr(req)
        
        if(!user) {
            res.status(401).end();
            console.log("> getpost.js: ERROR: User not logged in!")
            return;
        }


        const {authID, postID, statement, map, mapLink, body} = await req.body
        console.log('> createPost.js: Recieved Info:',authID, postID, statement, map, mapLink, body, user)

        try{
            if(statement.trim()===''||body.trim()===''){
                throw "Please fill in all fields!"
            }
            if(authID !== user.uid){
                throw "You are not authorized to make edits to this post"
            }

            const resdb = await runner('updateBulletin', [ postID, statement, map, mapLink, body ])

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