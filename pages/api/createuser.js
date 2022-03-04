import { createUser } from '../../lib/database/dbusers'

export default async function handler(req,res){
    const { firstname,lastname,email,phone,street,city,state,zip,username,password } = await req.body
    console.log('createuser.js', username, password)

    try{
        console.log('preapring to create user!')
        const resdb = await createUser(firstname,lastname,email,phone,street,city,state,zip,username,password)

        console.log('createuser api:', resdb)

        if(!resdb.success){
            throw resdb.error
        }

        res.json(resdb)
    }catch(error){
        console.log('createuser error!', error)
        res.status(500).json({ message: error })
    }
}