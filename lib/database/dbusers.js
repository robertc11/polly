const { MongoClient } = require('mongodb')
const url = process.env.MONGO_URL

const client = new MongoClient(url)

export async function createUser(first,last,email,phone,street,city,state,zip,user,pass){
    const cityID = ["USA", state, "Collin", city]

    try{
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        console.log('> dbusers.js/createUser: connected to database!')


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
    }finally{
        await client.close()
        console.log('> dbusers.js/createUser: MONGODB Connection CLOSED')
    }
}

export async function validateInfo(usernameInput){
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
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        console.log('dbusers.js/validateInfo: connected to database!')


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
        return { found: false, error: err }
    }finally{
        await client.close()
        console.log('> dbusers.js/validateInfo: MONGODB Connection CLOSED')
    }
}

export async function validateUsername(usernameInput){
    const query = {"username": usernameInput}

    try{
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        console.log('> dbusers.js/validateUsername: connected to database!')


        // perform db search here
        const accountsDatabase = client.db('accounts')
        const usersCollection = accountsDatabase.collection('users')
        const res = await usersCollection.findOne(query)

        //console.log("resultant DB find:", res)

        // if res is null then no user with matching username was found 
        if(res === null){
            return {
                canUse: true,
            }
        }

        return { 
            canUse: false,
        }

    }catch(err){
        console.log('> dbusers.js/validateUsername: An unexpected error occurred:', err)
    }finally{
        await client.close()
        console.log('> dbusers.js/validateUsername: MONGODB Connection CLOSED')
    }
}