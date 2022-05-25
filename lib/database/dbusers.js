const { MongoClient } = require('mongodb')
const url = process.env.MONGO_URL


export async function runner(funcName,options){
    const client = new MongoClient(url)
    console.log('> dbusers.js: Here are the options:', ...options)

    try{
        await client.connect()
        
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
        await client.close()
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