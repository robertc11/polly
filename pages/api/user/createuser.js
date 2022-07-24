import { runner } from '../../../lib/database/dbusers'

const bcrypt = require('bcrypt');
const saltRounds = 10

export default async function handler(req,res){
    if(req.method === 'POST'){
        const { firstname,lastname,email,phone,street,city,state,zip,username,password } = await req.body
        console.log('> createuser.js:', username, password)

        await bcrypt.hash(password,saltRounds, async (err,hash) => {
            if(err){
                res.status(500).json({message:err})
            }
            const resdb = await runner('createUser',[ firstname,lastname,email,phone,street,city,state,zip,username,hash ])
            console.log('> createuser.js: Result:', resdb)

            if(!resdb.success){
                res.status(500).json({message:resdb.error})
            }
            res.json(resdb)
        })
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
    
}