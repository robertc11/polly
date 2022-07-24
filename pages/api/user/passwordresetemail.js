import { getSessionSsr } from "../../../lib/redis-auth/wrappers";
import { setResetCode } from "../../../lib/redis-auth/sessions";
import Email from "../../../lib/email";
import { runner } from "../../../lib/database/dbusers";

export default async function handler(req,res){
    if(req.method === "POST"){
        const user = await getSessionSsr(req)
        const { uid } = await req.body

        if(!user || user.uid !== uid) {
            res.status(401).end();
            console.log("> passwordreset.js: ERROR: User not logged in!")
            return
        }

        try{
            const status_code = await setResetCode(user.uid)
            if(!status_code.success) throw status_code.msg

            const user_email = await runner("getEmail", [uid])
            if(!user_email.success) throw "Could not find user email!"
            
            let email_res = await new Email(user, user_email.email, `https://www.pollyapp.io/verify/${uid}`).sendResetEmail(status_code.reset_code)
            if(!email_res) throw "Error sending email to address on file."

            res.status(200).json({
                success: true,
            })    
        }catch(err){
            console.log('> passwordreset.js:', err)
            res.status(500).json({
                success: false,
                msg: err,
            })
        }
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation"})
    }
}