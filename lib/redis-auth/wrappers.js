import { getSession } from "./sessions";

// should return an object if there is a user logged in or null if not
export async function getSessionSsr(req){
    const token = req?.cookies?.pollytoken || null
    if(!token) return null
    
    var res = await getSession(token)
    if(!res.success || !res.sessionActive) return null
    res = JSON.parse(res.sessionData)
    //console.log(res)

    return res
}