import cookie from "cookie"
import { destroySession } from "../../../lib/redis-auth/sessions"

export default async function handler(req,res){
    //console.log(req.cookies)
    const status = await destroySession(req.cookies.pollytoken)
    res.setHeader("Set-Cookie", cookie.serialize("pollytoken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0),
        sameSite: "strict",
        path: '/'
    }))
    res.statusCode = 200
    res.json({ success: true })
}