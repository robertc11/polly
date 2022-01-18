// React imports
import React, { useState } from 'react'

// component imports
import BulletinRow from '../components/bulletinRow'
import Logo from '../components/logo'
import Footer from '../components/footer'

import { getElections } from '../lib/civic'
import useUser from '../lib/useUser'
import fetchJson from "../lib/fetchJson";


//next imports
import Link from 'next/link'
import Head from 'next/head'
import Router from "next/router";


export default function webApp({ data }){
    const { user, mutateUser } = useUser({
        redirectTo: "/login",
    });

    const [screen, setScreen] = useState('hot')

    if(!user || user.isLoggedIn===false){  // skeleton loading page if the user accesses through url but not logged in
        return(
            <>
                    <Head>
                        <title>Loading</title>
                    </Head>

                    <div className="h-screen flex flex-col justify-center items-center p-5 font-dongji">
                        <h1 className="text-4xl text-sky-500 animate-bounce">Loading...</h1>
                    </div>
                </>
        )
    }

    return(
        <>
            <Head>
                <title>Polly-App</title>
            </Head>

            <p>{JSON.stringify(user)}</p>
            {data.elections.map((dataPoint) => {
                return (
                    <p>{JSON.stringify(dataPoint)}</p>
                )
            })}

            <div id="pageWrapper" className="grid grid-cols-6 grid-rows-6 gap-x-5 gap-y-2 p-5 font-dongji h-screen">
                <div id="summary" className="overflow-auto col-span-1 col-start-1 row-span-1 row-start-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-center flex justify-center items-center rounded-lg ">
                    <h1 className="text-3xl text-white">Richardson, TX</h1>
                </div>

                <div id="leftPanel" className="overflow-auto lg:h-96 md:h-80 sm:h-64 bg-violet-300 col-span-1 col-start-1 row-start-2 row-span-2 flex flex-col items-center rounded-lg shadow-lg">
                    <button className="px-5 py-8 border-b-2 border-white w-full h-1/4 duration-200 hover:bg-violet-100 rounded-t-lg flex justify-center items-center text-base" onClick={() => setScreen('hot')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>

                        <h1 className="ml-2 font-medium">Hot Topics</h1>
                    </button>

                    <button className="px-5 py-8 border-b-2 border-white w-full h-1/4 duration-200 hover:bg-violet-100 flex justify-center items-center" onClick={() => setScreen('bulletin')}>                        
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>

                        <h1 className="ml-2 font-medium">Bulletin Board</h1>
                    </button>

                    <button className="px-5 py-8 border-b-2 border-white w-full h-1/4 duration-200 hover:bg-violet-100 flex justify-center items-center" onClick={() => setScreen('cards')}>                        
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>

                        <h1 className="ml-2 font-medium">Candidate Cards</h1>
                    </button>

                    <button className="px-5 py-2 mt-1 w-full h-1/4 duration-200 hover:text-violet-100 flex justify-center items-center" 
                        onClick={async (e) => {
                            e.preventDefault()
                            mutateUser(
                                await fetchJson("/api/logout", { method: "POST" }),
                                false,
                            );
                            Router.push("/login")
                        }}
                    >                        
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>

                        <h1 className="ml-2 font-medium">Logout</h1>
                    </button>


                    <div className="h-full flex flex-col-reverse p-3 text-center">
                        <div className="flex justify-center items-center">
                            <Logo />
                            <h1 className="text-2xl">｜</h1>
                            <h2 className="">V. 1.0.1</h2>
                        </div>
                        
                    </div>
                </div>

                <div id="rightPanel" className="overflow-auto bg-slate-100 rounded-lg shadow col-span-5 col-start-2 row-span-full flex flex-col items-center p-5">
                    { screen==="bulletin" ? (
                        <div>
                            <h1 className="text-slate-700 text-4xl font-bold mt-3">Community Bulletin</h1>
                        </div>
                    ) : screen==="hot" ? (
                        <div>
                            <h1 className="text-slate-700 text-4xl font-bold mt-3">Hot and Trending</h1>
                        </div>
                    ) : screen==="cards" ? (
                        <div>
                            <h1 className="text-slate-700 text-4xl font-bold mt-3">Candidate Info Cards</h1>
                        </div>
                    ) : (
                        <p>404 Page Not Found</p>
                    )}
                </div>
            </div>
            
            <Footer />
            
        </>
    )
}



export async function getStaticProps(context){
    const data = await getElections()

    return {
        props: { data },
    }
}
