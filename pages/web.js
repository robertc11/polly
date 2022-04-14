// React imports
import React, { useState, useRef, useEffect } from 'react'
import useSWRInfinite from 'swr/infinite'


// component imports
import Logo from '../components/logo'
import BulletinDash from '../components/bulletinDash'
import ElectionDash from '../components/electionDash'

// Lib imports (data fetching)
import useUser from '../lib/useUser'
import fetchJson from "../lib/fetchJson"
import useBulletin from '../lib/useBulletin'
import useOnScreen from '../lib/useOnScreen'

//next imports
import Link from 'next/link'
import Head from 'next/head'
import Router from "next/router"
import { useRouter } from "next/router"



const PAGE_SIZE = 10

const getKey = (pageIndex, previousPageData, pageSize) => {
    if(previousPageData && !previousPageData.length) return null

    return `/api/posts/bulletin?per_page=${pageSize}&page=${pageIndex+1}`
}

const fetcher = url => fetch(url).then(r => r.json())




export default function WebApp(){
    // get a specified page from the url /web?page=XXX
    const router = useRouter()
    const { page } = router.query

    // setting up the infinite scroll
    const ref = useRef()
    const isVisible = useOnScreen(ref)

    const { user, mutateUser } = useUser({
        redirectTo: "/login",
    })

    const {data, error, mutate, size, setSize, isValidating} = useSWRInfinite(
        (...args) => getKey(...args, PAGE_SIZE),
        fetcher,
        {
            // refreshInterval: 5000,
            revalidateIfStale: false,
        }
    )


    const bulletins = data ? [].concat(...data) : []
    const isLoadingInitialData = !data && !error
    const isLoadingMore = isLoadingInitialData || (size>0 && data && typeof data[size-1]==='undefined')
    const isEmpty = data?.[0]?.length === 0
    const isReachingEnd = size === PAGE_SIZE
    const isRefreshing = isValidating && data && data.length === size

    useEffect(() => {
        if(isVisible && !isReachingEnd && !isRefreshing){
            setSize(size+1)
        }
    }, [isVisible, isRefreshing])



    // state to keep track of which screen is open and useEffect hook to set it to the url passed page param
    const [screen, setScreen] = useState('elections')
    useEffect(() => {
        console.log('YOOOHOO',page)
        if(!page) return
        setScreen(page)
    }, [page])
    

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

            <div id="webnav" className="w-full flex justify-between p-3 bg-gradient-to-r from-violet-500 to-indigo-500">
                <div className="flex items-center">
                    <h1 className="text-xl text-white font-bold ml-5">Hello, {user.first} {user.last}</h1>
                </div>
                <div className="flex items-center">
                    <Link href="/"><a><Logo theme={"light"} /></a></Link>
                    <h1 className="text-2xl text-white">｜</h1>
                    <Link href="/login">
                        <a className="font-bold text-white mr-5 text-lg"
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

            {/* <p>{JSON.stringify(bulletins)}</p> */}
            {/* <p>{page}</p> */}

            <div id="pageWrapper" className="flex py-5 w-2/3 font-dongji h-auto mx-auto">

                <div id="leftPanel" className="overflow-auto h-screen w-1/6 flex flex-col items-center">
                    <h1 className="text-lg font-semibold text-black">{user.cityID[3]}, {user.cityID[1]}</h1>
                    
                    <div className="flex flex-col items-baseline text-violet-500 text-sm">
                        <button className="px-2 py-5 border-b-2 border-white h-1/4 duration-200 hover:text-violet-100 flex justify-center items-center" onClick={() => setScreen('elections')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>

                            <h1 className="ml-2">Elections</h1>
                        </button>

                        <button className="px-2 py-5 border-b-2 border-white h-1/4 duration-200 hover:text-violet-100 flex justify-center items-center" onClick={() => setScreen('bulletins')}>                        
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
                            <h1 className="text-slate-800 font-bold text-2xl select-none">Polly</h1>
                            <h1 className="text-2xl text-black">｜</h1>
                            <h2 className="text-black">V. 1.0.1</h2>
                        </div>
                    </div>
                </div>

                <div id="middlePanel" className="h-auto border-l-[3px] border-slate-300 w-4/6 flex flex-col items-center">
                    { screen==="elections" ? (
                        <div>
                            <h1 className="text-slate-700 text-4xl font-bold mt-3">Elections</h1>
                        </div>
                        // <ElectionDash
                        //     uid={user.uid}
                        //     username={user.username}
                        //     cityid={user.cityID}
                        //     login={user.isLoggedIn}
                        // />
                    ) : screen==="bulletins" ? (
                        <div className="w-full">
                            <BulletinDash
                                uid={user.uid}
                                username={user.username}
                                cityid={user.cityID}
                                login={user.isLoggedIn}
                                bulletins={{bulletins}}
                            />
                            <div className="w-full text-bold text-center invisible" ref={ref}>
                                {isLoadingMore ? 'loading...' : isReachingEnd ? 'no more posts' : ''}
                            </div>
                        </div>
                    ) : screen==="cards" ? (
                        <div>
                            <h1 className="text-slate-700 text-4xl font-bold mt-3">Candidate Cards</h1>
                        </div>
                    ) : (
                        <p>404 Page Not Found</p>
                    )}
                </div>

                <div id="rightPanel" className="w-1/6 h-auto bg-blue-500 text-white flex flex-col items-center justify-center">
                    {/* <h1 className="rotate-90 text-2xl mb-5">YOUR</h1>
                    <h1 className="rotate-90 text-2xl mt-2 mb-5">AD</h1>
                    <h1 className="rotate-90 text-2xl mt-2">HERE</h1> */}
                </div>
            </div>
            
            {/* <Footer /> */}
            
        </>
    )
}

