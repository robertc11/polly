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
                    <h1 className="text-xl text-white font-bold ml-5">Hello, {user.first} {user.last}</h1>
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

            <div id="pageWrapper" className="flex py-5 w-2/3 font-dongji h-auto mx-auto">

                <div id="leftPanel" className="overflow-auto h-screen w-1/6 flex flex-col items-center">
                    <h1 className="text-lg text-slate-600">{user.cityID[3]}, {user.cityID[1]}</h1>
                    
                    <div className="flex flex-col items-baseline text-violet-500 text-sm">
                        <button className="px-2 py-5 border-b-2 border-white h-1/4 duration-200 hover:text-violet-100 flex justify-center items-center" onClick={() => setScreen('hot')}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                            </svg>

                            <h1 className="ml-2">Hot Topics</h1>
                        </button>

                        <button className="px-2 py-5 border-b-2 border-white h-1/4 duration-200 hover:text-violet-100 flex justify-center items-center" onClick={() => setScreen('bulletin')}>                        
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>

                            <h1 className="ml-2">Bulletin Board</h1>
                        </button>

                        <button className="px-2 py-5 border-b-2 border-white h-1/4 duration-200 hover:text-violet-100 flex justify-center items-center" onClick={() => setScreen('cards')}>                        
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>

                            <h1 className="ml-2">Polly Cards</h1>
                        </button>

                        <button className="text-slate-500 px-2 py-8 border-b-2 border-white h-1/4 duration-200 flex justify-center items-center duration-200 hover:text-violet-100 flex justify-center items-center" 
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
                    </div>

                    <div className="flex flex-col-reverse p-3 text-center">
                        <div className="flex justify-center items-center">
                            <Logo />
                            <h1 className="text-2xl text-black">｜</h1>
                            <h2 className="text-black">V. 1.0.1</h2>
                        </div>
                    </div>
                </div>

                <div id="middlePanel" className="h-auto border-l-2 border-slate-400 w-4/6 flex flex-col items-center">
                    { screen==="bulletin" ? (
                        <>
                            <div className="flex items-center relative w-full">
                                <h1 className="text-slate-700 text-center w-full text-4xl font-bold mt-3 mb-5">Community Bulletin</h1>
                                <div className="absolute p-5 rounded-full bg-emerald-300 shadow text-white right-4 hover:bg-emerald-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        
                            <div className="w-full">
                                {JSON.stringify(bulletins)==='[]' ? (
                                    <div className="flex flex-col justify-center items-center mx-auto p-5 text-slate-600 font-dongji">
                                        <h1>It's lonely in here <span className="text-2xl">😔</span></h1>
                                        <h2>Add a post for your community to see</h2>
                                    </div>
                                ) : (
                                    <div className="flex flex-col justify-center items-center mx-auto p-5 font-dongji">
                                        {bulletins.map((thisBulletin) => (
                                            <BulletinRow width={'wide'} up={thisBulletin.upvotes} down={thisBulletin.downvotes} statement={thisBulletin.statement} quotes={thisBulletin.comments} mapEnabled={thisBulletin.map} className="w-full">
                                                <iframe name="map" width="450" height="300" className="hidden mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src={thisBulletin.mapLink}></iframe> 
                                            </BulletinRow>
                                        ))}
                                    </div>    
                                )}       
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

                <div id="rightPanel" className="w-1/6 h-auto bg-blue-500 text-white flex flex-col items-center justify-center">
                    <h1 className="rotate-90 text-2xl mb-5">YOUR</h1>
                    <h1 className="rotate-90 text-2xl mt-2 mb-5">AD</h1>
                    <h1 className="rotate-90 text-2xl mt-2">HERE</h1>
                </div>
            </div>
            
            <Footer />
            
        </>
    )
}

