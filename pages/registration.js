// React Imports
import React, { useState } from 'react'

// Next JS Imports
import Head from 'next/head'
import Link from 'next/link'

// Component Imports
import Footer from '../components/footer'
import NavBar from '../components/navbar'
import BlockY from '../components/blockY'
import Form from '../components/form'


export default function register(){
    const [errorMsg, setErrorMsg] = useState("");

    return(
        <>
            <Head>
                <title>Create</title>
            </Head>

            <NavBar />

            <BlockY>
                <Form
                    screen={"register"}
                    errorMessage={errorMsg}
                    onClick={ async function handleSubmit(event){
                        event.preventDefault()

                        const body = {

                        }
                    }}
                >

                </Form>
            </BlockY>
            
        </>
    )
}