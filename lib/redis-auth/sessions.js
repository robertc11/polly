import client from './redis'
import { getCurrentUnix } from '../timestamp'
var crypto = require('crypto')
import { generateRandDigits } from '../generatenums'
import logger from '../../logger/logger'

const SESSION_LENGTH = 60*60*24*4  // base session time set to 4 days
const CODE_LENGTH = 60*10

export function generateKey(length=16){
    return crypto.randomBytes(length).toString('base64')
}


/* 
takes in a js object to put into redis and and expiration time which defaults to 5 days
returns the string of the sessionID
*/
export async function setSession(obj, exp=SESSION_LENGTH){
    const insertVal = JSON.stringify(obj)

    try{
        /* 
        Generates a unique session ID to use for the user's new session
        EXAT: number = Sessions set to expire at unix timestamp in seconds (not milliseconds!)
        NX: true = Redis will not override a current session if a duplicate sessionID is generated
        */

        let insertRes
        let expiretime = getCurrentUnix() + exp
        //console.log('ttl', expiretime, typeof(expiretime))
        do{
            var sessionID = generateKey()
            insertRes = await client.set(`session:${sessionID}`, insertVal, 'EXAT', expiretime, 'NX')
            //console.log(insertRes)
        }while(insertRes !== 'OK')

        return {
            success: true,
            session: sessionID
        }
    }catch(err){
        logger.error('Redis command error', err)
        return { success: false }
    }finally{
        //client.quit()
    }
}

// takes in the unique session id (should be 16 digits long)
export async function getSession(sessionID=null){
    if(!sessionID) return { success: false }

    try{
        let val = await client.get(`session:${sessionID}`)
        if(!val){ // no session was found
            return {
                success: true,
                sessionActive: false,
            }
        }else{
            // val = JSON.parse(val)
            logger.info(['*** sessions.js', val])
            return {
                success: true,
                sessionActive: true,
                sessionData: val
            }
        }
    }catch(err){
        logger.error('Redis command error', err)
        return { success: false }
    }finally{
        //client.quit()
    }
}

// takes in the unique session id (should be 16 digits long)
export async function destroySession(sessionID){
    try{
        let status = await client.del(`session:${sessionID}`)
        
        return {
            success: true
        }
    }catch(err){
        logger.error('Redis command error', err)
        return { success: false }
    }finally{
        //client.quit()
    }
}

// renew session extends the session for 4 days out (default) from when it was called
export async function renewSession(sessionID, exp=SESSION_LENGTH){
    try{
        let newexpiration = getCurrentUnix() + exp
        let status = await client.expireAt(`session:${sessionID}`, newexpiration, 'XX', 'GT')

        if(status !== "OK") throw "Could not set new expiration unix!"
        
        return {
            success: true
        }
    }catch(err){
        logger.error('Redis command error', err)
        return { success: false }
    }finally{
        //client.quit()
    }
}


// create password reset code for user
export async function setResetCode(uid, exp=CODE_LENGTH){
    const insertVal = String(generateRandDigits())

    try{
        /* 
        EXAT: number = Sessions set to expire at unix timestamp in seconds (not milliseconds!)
        NX: true = Redis will not override a current session if a duplicate sessionID is generated
        */

        let insertRes
        let expiretime = getCurrentUnix() + exp
        insertRes = await client.set(`resetcode:${uid}`, insertVal, 'EXAT', expiretime, 'NX')

        if(insertRes !== "OK"){
            if(insertRes === null){
                throw "A reset code has already been created!"
            }
            throw "Error creating reset code - try again later!"
        } 

        return {
            success: true,
            reset_code: insertVal,
        }
    }catch(err){
        logger.error('Redis command error', err)
        return { success: false, msg: err }
    }
}

// takes in a userid
export async function getResetCode(uid=null){
    if(!uid) return { success: false }

    try{
        let val = await client.get(`resetcode:${uid}`)
        if(!val){ // no session was found
            return {
                success: false,
            }
        }else{
            logger.info(['*** sessions.js', val])
            return {
                success: true,
                reset_code: val,
            }
        }
    }catch(err){
        logger.error('Redis command error', err)
        return { success: false }
    }
}

export async function destroyResetCode(uid){
    try{
        let status = await client.del(`resetcode:${uid}`)
        
        return {
            success: true
        }
    }catch(err){
        logger.error('Redis command error', err)
        return { success: false }
    }
}