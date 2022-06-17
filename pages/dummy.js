import Router from "next/router"
import { getSession } from "../lib/redis-auth/sessions"

export default function Dummy(){
    return (
        <>
            <button onClick={() => {
                fetch('/api/auth/logout', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({})
                }).then(res => res.json())
                .then(data => {
                    if(data.success) Router.push('/')
                })
                .catch(err => console.error(err))
            }}>LOGOUT</button>
        </>
    )
}

export async function getServerSideProps({ req }){
    console.log('context',req.cookies)
    const res = await getSession(req.cookies.pollytoken)
    const user = JSON.parse(res.sessionData)
    console.log(res, user)

    return {
        props: { user }
    }
}