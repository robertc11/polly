import { validateUsername } from "../../lib/database/dbusers"

export default async function handler(req,res){
    const { usernameInput } = await req.body
    console.log('this is the input to the api:',usernameInput)
    try{
        const resdb = await validateUsername(usernameInput)
        console.log('this is the result from api:', resdb)
        res.status(200).json(resdb.canUse)
    }catch(err){
        res.status(500).json("An unexpected error occurred")
    }
    
}