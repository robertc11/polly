import { verify } from "jsonwebtoken"

const authJWT = (fn) => async(req, res) => {
    verify(req.headers.authorization, process.env.SECRET, async function(err, decoded){
        if(!err && decoded){
            return await fn(req,res)
        }
        res.status(500).json({ message: "AUTH TOKEN INVALID" })
    })
}

export default authJWT(async function handler(req, res){
    if(req.method === "POST"){
        res.status(200).json({ message: "woo hoo! The JWT is valid!" })
    }else{
        res.status(405).json({ message: "POST supported only." })
    }
})