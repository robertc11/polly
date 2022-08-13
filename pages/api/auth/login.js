import cookie from 'cookie'
import { runner } from '../../../lib/database/dbusers'
import { setSession } from '../../../lib/redis-auth/sessions';
import logger from '../../../logger/logger'
const bcrypt = require('bcrypt');

export default async (req, res) => {
    if(req.method === "POST"){
        const { username, password } = await req.body
        console.log('> login.js:', username, password)

        try {
            if(username==="" || password===""){
                throw "Please fill in all fields!"
            }

            logger.info('> login.js: Performing validation...')
            const resdb = await runner('validateInfo',[ username.toLowerCase() ])
            logger.info(['> login.js: Validation result:', JSON.stringify(resdb)])

            if(!resdb.found){
                throw resdb.error
            }
            
            await bcrypt.compare(password,resdb.password, async (err,result) => {
                if(err){
                    console.log(err)
                    res.status(500).json({ message: "Authentication Error" })
                    return
                }
                if(result){
                    const user = {
                        isLoggedIn: true,
                        uid: resdb.uid,
                        username: resdb.username,
                        cityID: resdb.cityID,
                        zipcode: resdb.zipcode,
                        first: resdb.first,
                        last: resdb.last,
                    }
                    const token = await setSession(user)
                    logger.info(['this is the token', token.session])
                    res.setHeader( "Set-Cookie", cookie.serialize( "pollytoken", token.session, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            maxAge: 60*60*24*5,
                            sameSite: "strict",
                            path: '/'
                        })
                    )
                    res.statusCode = 200
                    res.json({ success: true })    
                }else{
                    res.status(500).json({ message: "You have entered an invalid username or password" })
                }
            })
        }catch(error){
            logger.error(['> login.js: ERROR:', error.name, error.message, error.cause])
            let errMsg = error.message===undefined ? error : error.message
            res.status(500).json({ message: errMsg })
        }
    }else{
        res.status(405).json({ message: "Login Sequence Failed!" })
    }
}