import { createClient } from 'redis'
import { getCurrentUnix } from '../timestamp'
var crypto = require('crypto')

const SESSION_LENGTH = 60*60*24*4  // base session time set to 4 days

export function generateKey(length=16){
    return crypto.randomBytes(length).toString('base64')
}


/* 
takes in a js object to put into redis and and expiration time which defaults to 5 days
returns the string of the sessionID
*/
export async function setSession(obj, exp=SESSION_LENGTH){
    const insertVal = JSON.stringify(obj)
    const client = createClient()
    client.on('error', (err) => console.log('Redis client error:', err))

    try{
        await client.connect()

        /* 
        Generates a unique session ID to use for the user's new session
        EXAT: number = Sessions set to expire at unix timestamp in seconds (not milliseconds!)
        NX: true = Redis will not override a current session if a duplicate sessionID is generated
        */

        let insertRes
        let expiretime = getCurrentUnix() + exp
        console.log('ttl', expiretime, typeof(expiretime))
        do{
            var sessionID = generateKey()
            insertRes = await client.set(`session:${sessionID}`, insertVal, {
                EXAT: expiretime,
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
                success: true,
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

// renew session extends the session for 4 days out (default) from when it was called
export async function renewSession(sessionID, exp=SESSION_LENGTH){
    const client = createClient()
    client.on('error', (err) => console.log('Redis client error', err))

    try{
        await client.connect()

        let newexpiration = getCurrentUnix() + exp
        let status = await client.expireAt(`session:${sessionID}`, newexpiration, {
            XX: true,  // a current expiration must already exist
            GT: true,  // you can only set the new expiration unix to the future
        })

        if(!status === "OK") throw "Could not set new expiration unix!"
        
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

