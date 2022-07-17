// Importing react elements
import React, { useState } from "react"

// Importing next elements
import Head from 'next/head'

//Importing lib files
import { getSessionSsr } from "../lib/redis-auth/wrappers";

// Importing components
import LoginForm from "../components/formlogin"
import Router from "next/router";


export async function getServerSideProps({ req }){
    const user = await getSessionSsr(req)

    if(user){
        return {
            redirect: {
                destination: '/web',
                permanent: false,
            }
        }
    }

    return {
        props: { user }
    }
}


export default function Login({ user }) {

    const [errorMsg, setErrorMsg] = useState("")
    const [loginCount, setLoginCount] = useState(1)

    return (
        <> 
            <Head>
                <title>Login</title>
            </Head>

            <div className="h-full">
                
                <div className="h-2/3 mt-20">
                    <LoginForm
                        errorMessage={errorMsg}
                        onSubmit={async function handleSubmit(event) {
                            event.preventDefault()
                            
                            const body = {
                                username: event.currentTarget.username.value,
                                password: event.currentTarget.password.value,
                            };

                            try {
                                fetch("/api/auth/login", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(body),
                                }).then(res => res.json())
                                .then(data => {
                                    if(data.success){
                                        Router.push("/web")
                                    }else{
                                        setErrorMsg("Your username or password was incorrect!")
                                        setLoginCount(loginCount+1)
                                    }
                                })
                            } catch (error) {
                                if(error instanceof FetchError){
                                    setErrorMsg(error.data.message)
                                    setLoginCount(loginCount+1)
                                }else{
                                    setErrorMsg("Your username or password was incorrect!")
                                    console.error("> /pages/login.js: An unexpected error happened:", error)
                                }
                            }
                        }}
                    />

                    
                    
                </div>
               
            </div>

        </>
    )
}