import { createClient } from 'redis'
var crypto = require('crypto')

export function generateKey(length=16){
    return crypto.randomBytes(length).toString('base64')
}

/* 
takes in a js object to put into redis and and expiration time which defaults to 5 days
returns the string of the sessionID
*/
export async function setSession(obj, exp=60*60*24*5){
    const insertVal = JSON.stringify(obj)
    const client = createClient()
    client.on('error', (err) => console.log('Redis client error:', err))

    try{
        await client.connect()

        /* 
        Generates a unique session ID to use for the user's new session
        EX: integer = Sessions set to expire in integer seconds
        NX: true = Redis will not override a current session if a duplicate sessionID is generated
        */

        let insertRes
        do{
            var sessionID = generateKey()
            insertRes = await client.set(`session:${sessionID}`, insertVal, {
                EX: exp,
                NX: true,
            })
        }while(insertRes !== 'OK')

        return {
            success: true,
            session: sessionID
        }
    }catch(err){
        console.log('Redis command error', err)
        return { success: false }
    }finally{
        client.quit()
    }
}

// takes in the unique session id (should be 16 digits long)
export async function getSession(sessionID=null){
    if(!sessionID) return { success: false }

    const client = createClient()
    client.on('error', (err) => console.log('Redis client error', err))

    try{
        await client.connect()

        let val = await client.get(`session:${sessionID}`)
        if(!val){ // no session was found
            return {
                sessionActive: false,
            }
        }else{
            // val = JSON.parse(val)
            console.log('*** sessions.js', val)
            return {
                success: true,
                sessionActive: true,
                sessionData: val
            }
        }
    }catch(err){
        console.log('Redis command error', err)
        return { success: false }
    }finally{
        client.quit()
    }
}

// takes in the unique session id (should be 16 digits long)
export async function destroySession(sessionID){
    const client = createClient()
    client.on('error', (err) => console.log('Redis client error', err))

    try{
        await client.connect()

        let status = await client.del(`session:${sessionID}`)
        
        return {
            success: true
        }
    }catch(err){
        console.log('Redis command error', err)
        return { success: false }
    }finally{
        client.quit()
    }
}
