import { getSessionSsr } from "../../../lib/redis-auth/wrappers";
import { setResetCode } from "../../../lib/redis-auth/sessions";

export default async function handler(req,res){
    if(req.method === "POST"){
        const user = await getSessionSsr(req)
        const { uid } = await req.body

        if(!user || user.uid !== uid) {
            res.status(401).end();
            console.log("> passwordreset.js: ERROR: User not logged in!")
            return
        }

        const status_code = await setResetCode(user.uid)
        if(!status_code.success) throw "Error creating a reset code!"

        res.status(200).json({
            success: true
        })
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation"})
    }
}