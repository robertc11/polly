import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "../../lib/session"
import { validateInfo } from '../../lib/database/dbusers'

const bcrypt = require('bcrypt');

export default withIronSessionApiRoute(async (req, res) => {
    const { username, password } = await req.body
    console.log('login.js', username, password)

    try {
        if(username==="" || password===""){
            throw "Please fill in all fields!"
        }

        console.log('doing validation')
        const resdb = await validateInfo(username.toLowerCase())
        console.log('finished validation! THIS IS RESDB', resdb)

        if(!resdb.found){
            throw resdb.error
        }
        
        await bcrypt.compare(password,resdb.password, async (err,result) => {
            if(err){
                console.log(err)
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
                req.session.user = user;
                await req.session.save();
                res.json(user);    
            }else{
                res.status(500).json({ message: "You have entered an invalid username or password" })
            }
        })
    }catch(error){
        console.log('kelly titty', error)
        let errMsg = error.message===undefined ? error : error.message
        res.status(500).json({ message: errMsg })
    }
}, sessionOptions)