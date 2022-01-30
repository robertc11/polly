const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:27017'

const client = new MongoClient(url)

export async function validateUsername(usernameInput){
    const query = {"username": usernameInput}

    try{
        await client.connect()
        await client.db("admin").command({ ping: 1 })
        //console.log('validateCredentials.js: connected to database!')


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
        console.log('An unexpected error occurred', err)
    }finally{
        await client.close()
        console.log('MONGODB Connection CLOSED')
    }
}