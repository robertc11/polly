// Importing react elements
import React, { useState } from "react"

// Importing next elements
import Head from 'next/head'
import Link from 'next/link'

//Importing lib files
import useUser from "../lib/useUser";
import fetchJson, { FetchError } from "../lib/fetchJson"
import { withSessionSsr } from "../lib/session";

// Importing components
import LoginForm from "../components/formlogin"
import NavBar from "../components/navbar"
import Footer from "../components/footer"
import Router from "next/router";

export const getServerSideProps = withSessionSsr( 
    async function getServerSideProps({ req }) {
        const user = req?.session?.user || null
        //console.log('this is the user shitter!', user)
        
        if(user){
            return {
                redirect: {
                    destination: '/web',
                    permanent: false,
                }
            }
        }

        return {
            props: {
                user
            }
        }
})


export default function Login({ user }) {
  // here we just check if user is already logged in and redirect to profile
    // const { mutateUser } = useUser({
    //     redirectTo: "/web",
    //     redirectIfFound: true,
    // })

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
                                    if(data.isLoggedIn){
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