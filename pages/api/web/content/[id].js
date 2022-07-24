import fs from 'fs';
import path from 'path';

const ext_converter = new Map()
ext_converter.set('.jpg','image/jpeg')
ext_converter.set('.png','image/png')
ext_converter.set('.pdf','application/pdf')
ext_converter.set('.mov','video/quicktime')
ext_converter.set('.mp4','video/mp4')

export default async function(req, res) {
    const id = req.query.id;
    const fileID = id.split('.')

    try {
        const filePath = path.join(process.cwd(), `/public/uploads/${fileID[0]}`)
        const stat = fs.createReadStream(filePath)
        const ext = '.'+fileID[1]

        await new Promise(function(resolve) {
            res.setHeader('Content-Type', ext_converter.get(ext))
            stat.pipe(res)
            stat.on('end', resolve)
            stat.on('error', function(err) {
                if (err.code === 'ENOENT') {
                    res.status(400).json({
                        success: false,
                        message: 'We could not find the file you requested!'
                    })
                    res.end()
                } else {
                    res.status(500).json({ 
                        success: false, 
                        message: 'Sorry, something went wrong!' 
                    })
                    res.end()
                }
            })
        })
    }catch(err){
        res.status(400).json({ success: false, message: err })
        res.end()
    }
}