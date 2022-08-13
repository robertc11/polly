import { runner } from "../../../lib/database/dbbulletins"
import { getSessionSsr } from "../../../lib/redis-auth/wrappers";
import logger from '../../../logger/logger'
import formidable from 'formidable'
import path from 'path'

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
            logger.error("> getpost.js: ERROR: User not logged in!")
            return;
        }

        const form = formidable({multiples: true, uploadDir: path.join(process.cwd(), `/public/uploads/`)})
        var attachments = []
        form.parse(req, async(err, fields, files) => {
            if(err){
                logger.error('> createpost.js: ERROR PARSING INCOMING DATA')
                res.status(500).end()
            }

            let incoming_file_data = Object.values(files)
            logger.info([fields])
            for(let i=0; i<incoming_file_data.length; i++){
                let file = incoming_file_data[i][0]
                attachments.push({file_name: file.newFilename, file_type: file.mimetype})
            }
            
            try{
                if(fields.statement[0].trim()===''||fields.body[0].trim()===''){
                    throw "Please fill in all fields!"
                }
                
                const resdb = await runner('createBulletin', [ 
                    parseInt(fields.upvotes[0]), 
                    parseInt(fields.downvotes[0]), 
                    fields.statement[0], 
                    (fields.map[0] === 'true'), 
                    fields.mapLink[0], 
                    fields.city[0], 
                    parseInt(fields.timestamp[0]), 
                    fields.body[0], 
                    (fields.anonymous[0] === 'true'),
                    attachments, 
                    user 
                ])
                
                if(!resdb.success){
                    throw resdb.msg
                }
    
                res.status(200).json({ success: true })
            }catch(err){
                logger.error(['> createpost.js: ERR:',err.name, err.message, err.cause])
                res.status(400).json({success: false, msg: err})
            }
        })
    }else{
        res.status(405).json({ message: "POST Requests Only. Reference Docs at Pollyapp.io/documentation" })
    }
}