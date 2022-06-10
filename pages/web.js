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
//import useBulletin from '../lib/useBulletin'
import useOnScreen from '../lib/useOnScreen'
import { getElections, getVoterInfo } from '../lib/civic'
import useBulletin from '../lib/useBulletin'
import useElections from '../lib/useElections'

//next imports
import Link from 'next/link'
import Head from 'next/head'
import Router from "next/router"
import { useRouter } from "next/router"
import CustomPopup from '../components/customPopup'




export default function WebApp(){
    // if user is not logged in take them back to login page
    const { user } = useUser({
        redirectTo: "/login",
    })
    const { elections } = useElections(user)

    // top checks the latest post in the database and sees if it is already shown on screen or not
    const [top, setTop] = useState(null)
    useEffect(() => {
        const checkNewPosts = async () => {
            //console.log('JUST A TEST!')
            const res = await fetch('/api/posts/getpost?per_page=1&obj_id=0').then(res => res.json()).catch((e) => console.log(e))
            
            setTop(res?.[0]?._id)
        }

        if(top === null){
            checkNewPosts()
        }
        var poller = setInterval(checkNewPosts, 90000)

        return () => {
            clearInterval(poller)
        }
    }, [])

    // setting up the infinite scroll element
    const ref = useRef()
    const isVisible = useOnScreen(ref)

    // handles grabbing the bulletin posts when you scroll and when you first load the bulletin page
    const [bulletins, setBulletins] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            let key = 0
            if(bulletins.length > 0){
                key = bulletins?.[bulletins.length-1]?._id
            }
            const res = await fetch(`/api/posts/getpost?per_page=${15}&obj_id=${key}`).then(res => res.json())
            setBulletins(bulletins.concat(res))
        }

        if(isVisible && !sessionStorage.getItem('bulletins')){
            fetchData()
        }
    }, [isVisible])

    const refreshFeed = () => {
        //console.log("fucking odngji")
        
        // scrolls back to top of screen
        smoothScroll().then(async () => {
            const res = await fetch(`/api/posts/getpost?per_page=${15}&obj_id=0`).then(res => res.json())
            setBulletins(res)
        }).catch((e) => {console.log('there was an error',e)})
    }

    const smoothScroll = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        })
        console.log('yuhh got to end of the scroll')

        return new Promise((resolve, reject) => {
            const failed = setTimeout(() => {
                reject()
            }, 2000)

            console.log('window pos', scrollY)
            const scrollHandler = () => {
                if(self.scrollY == 0){
                    window.removeEventListener('scroll', scrollHandler)
                    clearTimeout(failed)
                    resolve()
                }
            }

            if(self.scrollY == 0){
                //console.log('lesgoo dababy')
                clearTimeout(failed)
                resolve()
            }else{
                window.addEventListener('scroll', scrollHandler)
            }
        })
    }

    // get a specified page from the url /web?page=XXX
    const router = useRouter()
    const { page } = router.query

    // state to keep track of which screen is open and useEffect hook to set it to the url passed page param
    const [screen, setScreen] = useState('elections')
    useEffect(() => {
        if(!page) return
        setScreen(page)
    }, [page])


    const handleClickPost = (postid) => {
        if(sessionStorage.getItem('bulletins') || sessionStorage.getItem('scrollY') || sessionStorage.getItem('page')) return
        //console.log('eenie', bulletins)
        sessionStorage.setItem('bulletins', JSON.stringify(bulletins))
        console.log('setting the session',window.scrollY)
        sessionStorage.setItem('scrollY', window.scrollY)
        sessionStorage.setItem('page', 'bulletins')
        Router.push(`/viewpost/${postid}`)
        console.log('hello!',postid)
    }

    useEffect(() => {
        // load sessionStorage into state
        // then clear sessionStorage
        if(!(sessionStorage.getItem('bulletins') || sessionStorage.getItem('scrollY'))) return

        const completeLoadingAssets = new Promise((resolve, reject) => {
            let tempBulletins = sessionStorage.getItem('bulletins')
            tempBulletins = JSON.parse(tempBulletins)
            setBulletins(tempBulletins)
            setTop(tempBulletins[0]._id)
            setScreen(sessionStorage.getItem('page'))

            resolve()
        })
        
        console.log(JSON.parse(sessionStorage.getItem('bulletins')))
        const scrollDiff = parseFloat(sessionStorage.getItem('scrollY'))
        completeLoadingAssets.then((res) => {
            console.log('retrieving the session',scrollDiff)
            window.scrollTo(0, scrollDiff)
        }).catch((err) => {
            console.log('an error occurred!', err)
        })
        
        sessionStorage.removeItem('bulletins')
        sessionStorage.removeItem('scrollY')
        sessionStorage.removeItem('page')
        //sessionStorage.clear()
        //console.log('clear session storage if there is session storage!')
    }, [])

    const [popupVisible, setPopupVisible] = useState(true)
    const popupCloseHandler = (a) => {
        sessionStorage.setItem("kitten", "popped up once")
        setPopupVisible(a)
    }

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
                    <h1 className="text-xl text-white font-bold ml-5">Hello, {user?.first} {user?.last}</h1>
                </div>

                {/* <div className="md:block w-1/4">
                    <div className="relative flex items-center text-gray-400 focus-within:text-violet-400">
                        <span className="absolute left-4 h-6 flex items-center pr-3 border-r border-gray-300">
                            <svg xmlns="http://ww50w3.org/2000/svg" className="w-4 fill-current" viewBox="0 0 35.997 36.004">
                                <path id="Icon_awesome-search" data-name="search" d="M35.508,31.127l-7.01-7.01a1.686,1.686,0,0,0-1.2-.492H26.156a14.618,14.618,0,1,0-2.531,2.531V27.3a1.686,1.686,0,0,0,.492,1.2l7.01,7.01a1.681,1.681,0,0,0,2.384,0l1.99-1.99a1.7,1.7,0,0,0,.007-2.391Zm-20.883-7.5a9,9,0,1,1,9-9A8.995,8.995,0,0,1,14.625,23.625Z"></path>
                            </svg>
                        </span>
                        <input type="search" name="leadingIcon" id="leadingIcon" placeholder="Search here" className="w-full pl-14 pr-4 py-2.5 rounded-xl text-sm text-gray-600 outline-none border border-gray-300 focus:border-cyan-300 transition" />
                    </div>
                </div> */}

                <div className="flex items-center">
                    <Link href="/"><a><Logo theme={"light"} /></a></Link>
                    <h1 className="text-2xl text-white">｜</h1>
                    <Link href="/login">
                        <a className="font-bold text-white mr-5 text-lg"
                            onClick={async (e) => {
                                e.preventDefault()
                                sessionStorage.clear()
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
            {/* <p>{JSON.stringify(electionData)}</p> */}

            <div id="pageWrapper" className="flex py-5 w-3/4 xl:w-2/3 font-dongji h-auto mx-auto">

                <CustomPopup
                    onClose={(a) => popupCloseHandler(a)}
                    show={(popupVisible) && (user?.uid === "6267136047598ab239dd4789") && (!sessionStorage.getItem('kitten'))}
                    title="Hi Kelly!"
                    closeText="Close"
                >
                    <p className="text-lg w-full text-center">Pet Me!</p>
                    <div className="-mt-4 w-[400px] h-[400px] bg-[url('../public/kittenopen.svg')] bg-no-repeat hover:bg-[url('../public/kittenclosedhearts.svg')] hover:cursor-grabbing"></div>
                </CustomPopup>


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
                                sessionStorage.clear()
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
                            <span className="text-black text-xs xl:text-[1em]">V. 1.0.1</span>
                        </div>
                    </div>
                </div>

                <div id="middlePanel" className="h-auto border-l-[3px] border-slate-300 w-4/6 flex flex-col items-center">
                    <div className={(top !== bulletins?.[0]?._id && bulletins.length > 0 && screen==="bulletins")?"bg-sky-400 inset-x-0 mx-auto rounded-xl top-5 sticky z-50 hover:bg-sky-500":"hidden"}>
                        <button className="text-center font-dongji text-white w-full py-1 px-2" onClick={() => refreshFeed()}>New Posts</button>
                    </div>
                    { screen==="elections" ? (
                        <div className="w-full">
                            <ElectionDash
                                uid={user.uid}
                                username={user.username}
                                cityid={user.cityID}
                                login={user.isLoggedIn}
                                elections={elections}
                            />
                        </div>
                    ) : screen==="bulletins" ? (
                        <div className="w-full">
                            <BulletinDash
                                uid={user.uid}
                                username={user.username}
                                cityid={user.cityID}
                                login={user.isLoggedIn}
                                bulletins={{bulletins}}
                                handlePost={(id) => handleClickPost(id)}
                            />
                            <div className="w-full text-bold text-center invisible" ref={ref}>
                                fucker
                            </div>
                        </div>
                    ) : screen==="cards" ? (
                        <div>
                            <h1 className="text-slate-700 text-4xl font-bold mt-3">Candidate Cards</h1>
                        </div>
                    ) : (
                        <div className="h-screen w-full flex items-center justify-center flex-col">
                            <p className="text-xl font-dongji"><span className="text-3xl">404</span> - Page Not Found</p>
                            <Link href="/web?page=elections"><a className="mt-1 text-blue-500 underline">Take me back!</a></Link>
                        </div>
                    )}
                </div>

                <div id="rightPanel" className="w-1/6 h-auto text-white flex flex-col items-center">
                    <div className="sticky top-10 w-full">
                        { screen === "elections" ? (
                            <>
                                <div className="bg-gray-200 w-full py-6 h-screen rounded-md">
                                    
                                </div>
                            </>
                        ) : screen === "bulletins" ? (
                            <div className="h-screen relative">
                                <div id="newpostcontainer" className="bg-gray-200 w-full py-6 h-72 rounded-md">
                                    <button onClick={() => Router.push("/create")} className="py-1.5 px-3 xl:px-5 xl:py-2 rounded-md bg-emerald-300 text-md text-white right-4 hover:bg-emerald-500 flex items-center justify-center w-5/6 xl:w-3/4 mx-auto">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        New Post
                                    </button>
                                </div>

                                <div id="upwrapper" className="w-full py-6 rounded-md absolute bottom-0 mb-24">
                                    <button onClick={() => smoothScroll()} className="py-1.5 xl:py-2 rounded-xl bg-sky-400 text-md text-white right-4 hover:bg-sky-500 flex items-center justify-center w-8/12 xl:w-7/12 mx-auto">
                                        <p className="text-xs">Back to Top</p>
                                    </button>
                                </div>
                            </div>
                        ) : screen === "cards" ? (
                            <>
                                <div className="bg-gray-200 w-full py-6 h-screen rounded-md">
                                    
                                </div>
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </div>
            
            {/* <Footer /> */}
            
        </>
    )
}

// export async function getStaticProps(context){
//     // const electionData = await getElections()
//     // replace with call to our api endpoint
//     // const electionData = await getVoterInfo('9900 Koupela Drive Raleigh NC')
//     const electionData = await fetch('/api/elections', {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             usercityid: user.cityID,
//         }),
//     }).then(res => res.json()).catch((e) => console.log(e))
    
//     return {
//         props: { electionData }
//     }
// }
