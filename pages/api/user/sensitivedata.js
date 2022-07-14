import { getSessionSsr } from '../../../lib/redis-auth/wrappers';
import { runner } from '../../../lib/database/dbusers';

export default async function handler(req,res){
    if(req.method === "GET"){
        const user = await getSessionSsr(req)
        
        if(!user) {
            res.status(401).end();
            console.log("> sensitivedata.js: ERROR: User not logged in!")
            return;
        }

        const {
            query: { uid },
        } = req

        try{
            const user_email = await runner("getEmail", [uid])
            const user_address = await runner("getAddress", [uid])
            if(user_email.success && user_address.success){
                res.status(200).json({
                    success: true,
                    email: user_email?.email,
                    address: user_address?.address,
                })
            }else{
                throw "Error fetching sensitive data!"
            }
        }catch(err){
            console.log("ERR:",err)
            res.status(500).json({success: false})
        }

    }else{
        res.status(405).json({ message: "GET Requests Only. Reference Docs at Pollyapp.io/documentation"})
    }
    
}