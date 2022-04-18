import { createUser } from '../../lib/database/dbusers'

const bcrypt = require('bcrypt');
const saltRounds = 10

export default async function handler(req,res){
    const { firstname,lastname,email,phone,street,city,state,zip,username,password } = await req.body
    console.log('> createuser.js:', username, password)

    await bcrypt.hash(password,saltRounds, async (err,hash) => {
        if(err){
            res.status(500).json({message:err})
        }
        const resdb = await createUser(firstname,lastname,email,phone,street,city,state,zip,username,hash)
        console.log('> createuser.js: Result:', resdb)

        if(!resdb.success){
            res.status(500).json({message:resdb.error})
        }
        res.json(resdb)
    })
}