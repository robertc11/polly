import { sign } from 'jsonwebtoken'

export default async function handler(req, res){
    if(req.method === "GET"){
        const payload = {
            uid: "622ba77a1e71f718701db001"
        }
        const jwt = sign(payload, process.env.SECRET, {
            expiresIn: '1h'
        })
        res.status(200).json({ authToken: jwt})
    }else{
        res.status(405).json({ message: "GET requests only."})
    }
}