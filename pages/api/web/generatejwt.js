import { sign } from 'jsonwebtoken'

export default async function handler(req, res){
    if(req.method === "GET"){
        const payload = {
            data: "Kellys feet are delicious and I want to lick them",
            uid: "622ba77a1e71f718701db001"
        }
        const jwt = sign(payload, '0c24670c-a9f6-4acb-a509-49f6136b71b6', {
            expiresIn: '1h'
        })
        res.status(200).json({ authToken: jwt})
    }else{
        res.status(405).json({ message: "GET requests only."})
    }
}