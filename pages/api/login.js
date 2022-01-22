import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "../../lib/session"
import { validateInfo } from '../../lib/validateCredentials'


export default withIronSessionApiRoute(async (req, res) => {
    const { username, password } = await req.body
    console.log('login.js', username, password)

    try {
        if(username==="" || password===""){
            throw "Please fill in all fields!"
        }

        let resdb = "default"
        
        console.log('doing validation')
        resdb = await validateInfo(username, password)
        console.log('finished validation! THIS IS RESDB', resdb)

        if(!resdb.found){
            throw resdb.error
        }

        const user = {
            isLoggedIn: true,
            username: resdb.username,
            cityID: resdb.cityID,
            zipcode: resdb.zipcode,
            first: resdb.first,
            last: resdb.last,
        }
        req.session.user = user;
        await req.session.save();
        res.json(user);

    }catch(error){
        console.log('kelly titty', error)
        let errMsg = error.message===undefined ? error : error.message
        res.status(500).json({ message: errMsg })
    }
}, sessionOptions)