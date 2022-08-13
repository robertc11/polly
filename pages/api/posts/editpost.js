import { runner } from "../../../lib/database/dbbulletins"
import { getSessionSsr } from "../../../lib/redis-auth/wrappers";
import logger from '../../../logger/logger'
import formidable from 'formidable'
import path from "path"

export const config = {
    api: {
        bodyParser: false,
    }
}

export default async function handler(req,res){
    if(req.method === "POST"){
        const user = await getSessionSsr(req)
        
        if(!user) {
            res.status(401).end();
            logger.warn("> getpost.js: ERROR: User not logged in!")
            return;
        }

        const form = formidable({multiples: true, uploadDir: path.join(process.cwd(), `/public/uploads/`)})
        var attachments = []
        form.parse(req, async(err, fields, files) => {
            if(err){
                logger.error('> editpost.js: ERROR PARSING INCOMING DATA')
                res.status(500).end()
            }

            let incoming_file_data = Object.values(files)
            let old_file_data = JSON.parse(fields.oldFiles[0])
            for(let i=0; i<incoming_file_data.length; i++){
                let file = incoming_file_data[i][0]
                attachments.push({
                    file_name: file.newFilename,
                    file_type: file.mimetype
                })
            }
            for(let i=0; i<old_file_data.length; i++){
                let file = old_file_data[i]
                attachments.push({
                    file_name: file.file_data.name,
                    file_type: file.file_data.type
                })
            }
            logger.info([attachments])
            try{
                if(fields.statement[0].trim()===''||fields.body[0].trim()===''){
                    throw "Please fill in all fields!"
                }
                if(fields.authID[0] !== user.uid){
                    throw "Not authorized to make changes to this post"
                }
                
                const resdb = await runner('updateBulletin', [ 
                    fields.postID[0],
                    fields.statement[0], 
                    (fields.map[0] === 'true'), 
                    fields.mapLink[0], 
                    fields.body[0], 
                    (fields.anonymous[0] === 'true'),
                    attachments,
                ])
                
                if(!resdb.success){
                    throw resdb.msg
                }
    
                res.status(200).json({ success: true })
            }catch(err){
                console.log('> editpost.js: ERR:',err)
                res.status(400).json({success: false, msg: err})
            }
        })
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}