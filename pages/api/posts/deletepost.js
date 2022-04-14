import { removeBulletin } from "../../../lib/database/dbbulletins"

export default async function handler(req,res){
    const { postID } = await req.body
    console.log('> deletepost.js:',postID)

    try{
        const resdb = await removeBulletin(postID)
        
        if(!resdb.success){
            throw resdb.msg
        }

        res.status(200).json({ success: true })
    }catch(err){
        res.status(500).json({success: false, msg: err})
    }
}