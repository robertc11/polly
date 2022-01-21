// React imports
import React, { useState } from 'react'

// component imports
import BulletinRow from '../components/bulletinRow'
import Logo from '../components/logo'
import Footer from '../components/footer'

// Lib imports (data fetching)
import useUser from '../lib/useUser'
import fetchJson from "../lib/fetchJson";
import useBulletin from '../lib/useBulletin'


//next imports
import Link from 'next/link'
import Head from 'next/head'
import Router from "next/router";


export default function webApp(){
    const { user, mutateUser } = useUser({
        redirectTo: "/login",
    });

    const { bulletins } = useBulletin(user)



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

            <div className="w-full flex justify-between p-3 bg-gradient-to-r from-violet-500 to-indigo-500">
                <div className="flex items-center">
                    <h1 className="text-xl text-white font-bold ml-5">Hello, {user.username}</h1>
                </div>
                <div className="flex items-center">
                    <Link href="/"><a><Logo theme={"light"} /></a></Link>
                    <h1 className="text-2xl text-white">｜</h1>
                    <Link href="/login">
                        <a className="font-bold text-white mr-5"
                            onClick={async (e) => {
                                e.preventDefault()
                                mutateUser(
                                    await fetchJson("/api/logout", { method: "POST" }),
                                    false,
                                );
                            }}
                        >
                            Logout
                        </a>
                    </Link>
                </div>
            </div>

            <div id="pageWrapper" className="flex p-5 font-dongji h-auto">

                <div id="leftPanel" className="overflow-auto mr-1.5 h-screen w-1/5 flex flex-col items-center">
                    <div id="summary" className="mb-5 px-5 py-10 w-full overflow-auto col-span-1 col-start-1 row-span-1 row-start-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-center flex flex-col justify-center items-center rounded-lg ">
                        <h1 className="text-2xl text-white">{user.cityID[3]}, {user.cityID[1]}</h1>
                    </div>
                    
                    <div className="w-full bg-violet-300 flex flex-col items-center rounded-lg shadow-lg">
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
                </div>

                <div id="rightPanel" className="h-auto border-l-4 border-slate-400 w-4/5 ml-1.5 flex flex-col items-center">
                    { screen==="bulletin" ? (
                        <>
                            <div className="flex items-center">
                                <h1 className="text-slate-700 text-center text-4xl font-bold mt-3 mb-5">Community Bulletin</h1>
                                <div className="absolute p-5 rounded-full bg-emerald-300 shadow text-white right-5 hover:bg-emerald-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        
                            <div className="w-full">
                                <div className="rounded-lg flex flex-col justify-center items-center mx-auto shadow-lg bg-violet-100 w-10/12 p-5 font-dongji mb-10">
                                    {bulletins.map((thisBulletin) => (
                                        <BulletinRow up={thisBulletin.upvotes} down={thisBulletin.downvotes} statement={thisBulletin.statement} quotes={thisBulletin.comments} mapEnabled={thisBulletin.map}>
                                            <iframe name="map" width="450" height="300" className="hidden mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src={thisBulletin.mapLink}></iframe> 
                                        </BulletinRow>
                                    ))}
                                </div>
                            </div>
                        </>
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

