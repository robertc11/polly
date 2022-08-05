const { ObjectId } = require('mongodb')
import clientPromise from './mongodb'
//import  logger1 from '../../logger/logger'
//const logger = require ('../logger/logger')

//const logger = require ('../../logger/logger')

export async function runner(funcName,options){

    // const myFormat = printf(({ level, message, label, timestamp }) => {
    //     return `${timestamp} [${label}] ${level}: ${message}`;
    //   });

   
const process = require('process');
const path = require('path');
const winston = require('winston');
const {format} = require('winston');
const { combine, printf, label} = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message} `;
  });
  
//const path2 = path.resolve(process.cwd())
const path3 = path.join(process.cwd(), __filename)
  

const logger = winston.createLogger({

    level: 'info',
    format: combine(
    //winston.format.colorize({ all: true }),
    label({ label: `${path3}` }),
    winston.format.json(), 
    winston.format.timestamp(), 
    myFormat,

),
    
    //myFormat
  
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: '/mnt/c/Users/rober/Documents/pollyganggang/polly-winston/error.log', level: 'error' }),
    new winston.transports.File({ filename: '/mnt/c/Users/rober/Documents/pollyganggang/polly-winston/combined.log', colorize: true }),
  ],
});

//logger.info(path2)
//logger.info(path3)



    const client = await clientPromise
    console.log('> dbusers.js: Here are the options:', ...options)
    logger.info('User has logged in')

    try{        
        var data = null
        switch(funcName){
            case 'createUser':
                data = await createUser(client, ...options)
                break
            case 'validateInfo':
                data = await validateInfo(client, ...options)
                break
            case 'validateUsername':
                data = await validateUsername(client, ...options)
                break
            case 'getAddress':
                data = await getAddress(client, ...options)
                break
            case 'getEmail':
                data = await getEmail(client, ...options)
                break
            case 'deleteUser':
                data = await deleteUser(client, ...options)
                break
            case 'editPassword':
                data = await editPassword(client, ...options)
                break
            default:
                throw "undefined function call"
        }

        if(!data){
            throw 'No information was returned'
        }

        return data

    }catch(err){
        console.log('> dbusers.js/runner: An unexpected error occurred', err)
        return {
            success: false,
            error: err,
        }
    }finally{
        //await client.close()
    }
}

async function createUser(client,first,last,email,phone,street,city,state,zip,user,pass){
    const cityID = ["USA", state, "Collin", city]

    try{
        // perform db search here
        const accountsDatabase = client.db('accounts')
        const usersCollection = accountsDatabase.collection('users')
        const res = await usersCollection.insertOne({
            cityID: cityID, 
            first: first, 
            last: last, 
            phone: phone, 
            address: street, 
            zipcode: zip, 
            username: user, 
            password: pass, 
            email: email,
        })

        return {
            success: true,
        }

    }catch(err){
        console.log('> dbusers.js/createUser: An unexpected error occurred:', err)
        return {
            success: false,
            error: err,
        }
    }
}

async function validateInfo(client,usernameInput){
    const queryUsername = {"username": usernameInput}
    const queryEmail = {"email": usernameInput}

    const validateEmail = (email) => {  // ripped off stackoverflow :) - checks if they are using email to log in 
        return String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    var isEmail = validateEmail(usernameInput)
    var query = isEmail ? queryEmail : queryUsername

    try{
        // perform db search here
        const accountsDatabase = client.db('accounts')
        const usersCollection = accountsDatabase.collection('users')
        const res = await usersCollection.findOne(query)

        console.log("> dbusers.js/validateInfo: Resultant DB find:", res)

        // if res is null then no user with matching password was found - throw an exception
        if(res === null){
            throw "You have entered an invalid username or password"
        }

        return {
            success: true,
            found: true,
            error: null,
            uid: res._id,
            username: res.username,
            zipcode: res.zipcode,
            cityID: res.cityID,
            first: res.first,
            last: res.last,
            password: res.password,
        }

    }catch(err){
        console.log('> dbusers.js/validateInfo: USER NOT FOUND:', err)
        return { success: false, found: false, error: err }
    }
}

async function validateUsername(client,usernameInput){
    const query = {"username": usernameInput}

    try{
        // perform db search here
        const accountsDatabase = client.db('accounts')
        const usersCollection = accountsDatabase.collection('users')
        const res = await usersCollection.findOne(query)

        //console.log("resultant DB find:", res)

        // if res is null then no user with matching username was found 
        if(res === null){
            return {
                success: true,
                canUse: true,
            }
        }

        return {
            success: false,
            canUse: false,
        }

    }catch(err){
        console.log('> dbusers.js/validateUsername: An unexpected error occurred:', err)
        return {
            success: false,
            error: err,
        }
    }
}

async function getAddress(client, uid){
    const query = { _id: ObjectId(uid) }

    try{
        const accountsDatabase = client.db('accounts')
        const res = await accountsDatabase.collection('users').findOne(query)

        if(res === null){
            throw "User could not be found"
        }

        return {
            success: true,
            address: res.address,
        }
    }catch(err){
        console.log('> dbusers.js/getAddress: ERROR:', err)
        return {
            success: false,
            error: err,
        }
    }
}

async function getEmail(client, uid){
    const query = { _id: ObjectId(uid) }

    try{
        const accountsDatabase = client.db('accounts')
        const res = await accountsDatabase.collection('users').findOne(query)

        if(res === null){
            throw "User could not be found"
        }

        return {
            success: true,
            email: res.email,
        }
    }catch(err){
        console.log('> dbusers.js/getEmail: ERROR:', err)
        return {
            success: false,
            error: err,
        }
    }
}

async function deleteUser(client, uid){
    // delete user in user table
    // delete references to user in bulletinusers table

    // delete all posts associated with user 
    const query_a = { _id: ObjectId(uid) }
    const query_b = {
        'author.authorID': ObjectId(uid)
    }
    const query_c = {
        user: ObjectId(uid)
    }

    try{
        const accountsDatabase = client.db('accounts')
        const res_users = await accountsDatabase.collection('users').deleteOne(query_a)
        if(res_users.deletedCount !== 1){
            throw "Error deleting user from users collection"
        }
        const bulletinsDatabase = client.db('bulletin')
        const res_posts = await bulletinsDatabase.collection('bulletinposts').deleteMany(query_b)
        const res_bullusers = await bulletinsDatabase.collection('bulletinusers').deleteMany(query_c)

        return {
            success: true,
            users_deleted: res_users.deletedCount,
            posts_deleted: res_posts.deletedCount,
        }

    }catch(err){
        console.log('> dbusers.js/deleteUser: ERROR:', err)
        return {
            success: false,
            error: err,
        }
    }
}

async function editPassword(client, uid, password){
    const filter = {
        _id: ObjectId(uid) 
    }
    const update_doc = {
        $set: {
            password: password,
        }
    }

    try{
        const accountsDatabase = client.db('accounts')
        const result = await accountsDatabase.collection('users').updateOne(filter, update_doc)

        return {
            success: true,
        }
    }catch(err){
        console.log('> dbusers.js/editPassword: ERROR:', err)
        return {
            success: false,
            error: err,
        }
    }
}