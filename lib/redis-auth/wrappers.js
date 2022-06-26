import { getSession } from "./sessions";

/*
Takes in a param req the http request object
Returns an object with the user's data if found in redis,
otherwise returns null
*/
export async function getSessionSsr(req){
    var token = req?.cookies?.pollytoken || null  // check to see if the cookie exists and has the session token
    if(!token){  // if not, then check to see if the token has been passed through the authorization header
        token = req?.headers?.authorization || null
    }
    //console.log('wrappers.js:',token)
    if(!token) return null
    
    var res = await getSession(token)
    if(!res.success || !res.sessionActive) return null
    res = JSON.parse(res.sessionData)
    //console.log(res)

    return res
}