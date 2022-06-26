import { getSessionSsr } from "../../../lib/redis-auth/wrappers";

export default async function handler(req,res){
    const user = await getSessionSsr(req)
    if(!user){
        res.json({
            isLoggedIn: false,
        })
    }else{
        res.json(user)
    }
}