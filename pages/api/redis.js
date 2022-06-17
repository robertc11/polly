import { setSession, getSession } from "../../lib/redis-auth/sessions";

export default async function handler(req,res){
    const body = await req.body
    console.log('*** redis.js', body)
    var res = await setSession(body, 60)
    console.log('*** redis.js',res)
    var res2 = await getSession("z0Fo7TBjC71ttjV9OweksA==")
    console.log(res2)

    res.status(200)
}