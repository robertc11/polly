import { getSessionSsr } from '../../../lib/redis-auth/wrappers';
import { runner } from '../../../lib/database/dbusers';

export default async function handler(req,res){
    if(req.method === "POST"){
        const user = await getSessionSsr(req)
        const { uid } = await req.body

        if(!user || user.uid !== uid) {
            res.status(401).end();
            console.log("> delete.js: ERROR: User not logged in!")
            return;
        }
        
        try{
            const resdb = await runner("deleteUser", [uid])
            console.log(resdb)
            if(resdb.success){
                res.status(200).json({
                    success: true,
                    posts_deleted: res.posts_deleted,
                })
            }else{
                throw "Error fetching sensitive data!"
            }
        }catch(err){
            console.log("ERR:",err)
            res.status(500).json({success: false, msg: "Could not delete user at this time"})
        }

    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation"})
    }
    
}