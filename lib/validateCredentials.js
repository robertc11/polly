const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017'

const client = new MongoClient(url)

export async function validateInfo(usernameInput, passwordInput){
    const queryUsername = {"username": usernameInput, "password": passwordInput}
    const queryEmail = {"email": usernameInput, "password": passwordInput}

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
        console.log('validateCredentials.js: connected to database!')


        // perform db search here
        const accountsDatabase = client.db('accounts')
        const usersCollection = accountsDatabase.collection('users')
        const res = await usersCollection.findOne(query)

        console.log("resultant DB find:", res)

        // if res is null then no user with matching password was found - throw an exception
        if(res === null){
            throw "You have entered an invalid username or password"
        }

        return { 
            found: true,
            error: null,
            username: res.username,
            zipcode: res.zipcode,
            cityID: res.cityID,
            first: res.first,
            last: res.last,
        }

    }catch(err){
        console.log('USER NOT FOUND', err)
        return { found: false, error: err }
    }finally{
        await client.close()
        console.log('MONGODB Connection CLOSED')
    }
}




