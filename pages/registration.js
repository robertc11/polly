// React Imports
import React, { useState } from 'react'


// Next JS Imports
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'

// Lib Imports
import fetchJson, { FetchError } from "../lib/fetchJson"

// Component Imports
import Footer from '../components/footer'
import NavBar from '../components/navbar'
import BlockY from '../components/blockY'
import RegistrationForm from '../components/formregister'
import { convertRegion } from '../lib/states'



export default function Register(){
    const [errorMsg, setErrorMsg] = useState("");

    return(
        <>
            <Head>
                <title>Create</title>
            </Head>

            <NavBar />

            <BlockY>
                <RegistrationForm
                    errorMessage={errorMsg}
                    onSubmit={ async function handleSubmit(event){
                        event.preventDefault()

                        const body = {
                            firstname: event.currentTarget.firstname.value,
                            lastname: event.currentTarget.lastname.value,
                            email: event.currentTarget.email.value.toLowerCase(),
                            phone: event.currentTarget.phone.value.split('-').join(''),
                            street: event.currentTarget.streetaddress.value,
                            city: event.currentTarget.city.value,
                            state: event.currentTarget.state.value,
                            zip: event.currentTarget.zipcode.value,
                            username: event.currentTarget.username.value.toLowerCase(),
                            password: event.currentTarget.password.value,
                        }

                        if(body.state.length > 2){
                            body.state = convertRegion(body.state, 2)
                        }

                        console.log("> registration.js: NEW USER:",body)

                        try{
                            const res = await fetchJson("/api/web/createuser", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body),
                            })
                            if(res.success){
                                Router.push("/login")
                            }
                        }catch(error){
                            if(error instanceof FetchError){
                                setErrorMsg(error.message)
                            }else{
                                console.error("> registration.js: An unexpected error happened:", error)
                            }
                        }
                    }}
                />

            </BlockY>
            
        </>
    )
}