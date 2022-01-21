// Importing react elements
import React, { useState } from "react"

// Importing next elements
import Head from 'next/head'
import Link from 'next/link'

//Importing lib files
import useUser from "../lib/useUser";
import fetchJson, { FetchError } from "../lib/fetchJson"

// Importing components
import Form from "../components/form"
import NavBar from "../components/navbar"
import Footer from "../components/footer"


export default function Login() {
  // here we just check if user is already logged in and redirect to profile
    const { mutateUser } = useUser({
        redirectTo: "/web",
        redirectIfFound: true,
    })

    const [errorMsg, setErrorMsg] = useState("")
    const [loginCount, setLoginCount] = useState(1)

    return (
        <> 
            <Head>
                <title>Login</title>
            </Head>

            <div className="h-screen">

                <NavBar />
                
                <div>
                    <Form
                        screen={"login"}
                        errorMessage={errorMsg}
                        onSubmit={async function handleSubmit(event) {
                            event.preventDefault()
                            
                            const body = {
                                username: event.currentTarget.username.value,
                                password: event.currentTarget.password.value,
                            };

                            try {
                                mutateUser(
                                    await fetchJson("/api/login", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(body),
                                    }),
                                )
                            } catch (error) {
                                if(error instanceof FetchError){
                                    setErrorMsg(error.data.message)
                                    setLoginCount(loginCount+1)
                                }else{
                                    console.error("An unexpected error happened:", error)
                                }
                            }
                        }}
                        attempts={loginCount}
                    />

                    
                    
                </div>
                
                <span className="absolute bottom-0 w-full mx-auto"><Footer /></span>
               
            </div>

        </>
    )
}