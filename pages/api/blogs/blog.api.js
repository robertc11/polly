// import { withIronSessionApiRoute } from "iron-session/next";
// import { sessionOptions } from "../../../lib/session";

// export default withIronSessionApiRoute(handleBlogFetch, sessionOptions)


export default function handler (req, res) {
    try {
    res.status(200).json("The blog api service recieved the request :)")
    console.log(req.body)

}
catch(error){
    res.status(500).json(" There might be an error with your request ")
console.log(error)
}}

