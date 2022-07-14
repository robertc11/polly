import Head from "next/head"
import Webnav from "../components/webnav"
import { getSessionSsr } from "../lib/redis-auth/wrappers"
import { useState } from "react"
import { runner } from "../lib/database/dbusers"
import Router from "next/router"
import Swal from 'sweetalert2'
import Footer from '../components/footer'



export async function getServerSideProps({ req }){
    const user = await getSessionSsr(req)

    if(!user){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    const user_email = await runner("getEmail", [user.uid])
    const user_address = await runner("getAddress", [user.uid])

    return {
        props: { 
            user: user,
            email: user_email?.email || null,
            address: user_address?.address || null,
        }
    }
}

export default function Settings({ user, email, address }){
    const [page, setPage] = useState(0)
    return (
        <>
            <Head>
                <title>Settings</title>
            </Head>

            <Webnav user={user} redirect={'/web'}></Webnav>

            <div className="w-full min-h-screen font-dongji bg-[#f5f5f5]">
                <div className="w-2/3 mx-auto min-h-screen flex">
                    <div className="flex-none bg-slate-200 min-h-screen text-left">
                        <ul className="min-h-screen text-slate-900">
                            <li className="py-5 px-5 flex align-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <button onClick={() => setPage(0)}>Account Settings</button>
                            </li>
                            <li className="py-5 px-5 flex align-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                                <button onClick={() => setPage(1)}>Password Settings</button>  
                            </li>
                            <li className="py-5 px-5 flex align-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                                </svg>
                                <button onClick={() => setPage(2)}>Email Settings</button>
                            </li>
                            <li className="py-5 px-5 flex align-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <button onClick={() => setPage(3)}>Notifications</button>
                            </li>
                        </ul>
                    </div>

                    {page === 0 ? (
                        <div className="px-5 py-5 bg-white flex-1 border-l-[3px] border-slate-300 pb-10">
                            <h1 className="text-3xl font-semibold">Account Information</h1>
                            <br></br>
                            <h2 className="text-xl font-semibold mb-1">Overview</h2>
                            <ul className="w-2/3">
                                <li className="flex justify-between py-2 border-b-2">
                                    <p>User ID</p>
                                    <p className="text-violet-600 font-bold">{user?.uid}</p>
                                </li>
                                <li className="flex justify-between py-2 border-b-2">
                                    <p>Username</p>
                                    <p className="text-violet-600 font-bold">{user?.username}</p>
                                </li>
                                <li className="flex justify-between py-2 border-b-2">
                                    <p>Display Name</p>
                                    <p className="text-violet-600 font-bold">{user?.first} {user?.last}</p>
                                </li>
                                <li className="flex justify-between py-2 border-b-2">
                                    <p>Email</p>
                                    <p className="text-violet-600 font-bold">{email}</p>
                                </li>
                                <li className="flex justify-between py-2 border-b-2">
                                    <p>City ID</p>
                                    <p className="text-violet-600 font-bold">[{user?.cityID[0]},{user?.cityID[1]},{user?.cityID[2]},{user?.cityID[3]}]</p>
                                </li>
                                <li className="flex justify-between py-2 border-b-2">
                                    <p>Address</p>
                                    <p className="text-violet-600 font-bold">{address} {user?.cityID[3]}, {user?.cityID[1]}</p>
                                </li>
                            </ul>
                            <button 
                                onClick={null}
                                className="px-5 rounded border-2 border-violet-400 mt-2 text-violet-600 hover:bg-violet-400 hover:text-white"
                            >
                                Edit
                            </button>

                            <h2 className="text-xl font-semibold mt-10 mb-1">Management</h2>
                            <ul>
                                <li className="py-2">
                                    <button className="border-2 px-5 py-1 rounded-md border-red-500 hover:bg-red-500 hover:text-white"
                                        onClick={async (e) => {
                                            e.preventDefault()
                    
                                            fetch('/api/auth/logout', { method: "POST" })
                                            .then(res => res.json)
                                            .then(data => {
                                                if(!data.isLoggedIn){
                                                    sessionStorage.clear()
                                                    Router.push("/login")
                                                }
                                            })
                                            .catch(err => console.error(err))
                                        }}
                                    >
                                        Log Out
                                    </button>
                                </li>
                                <li className="py-2">
                                    <button className="border-2 px-5 py-1 rounded-md border-red-500 hover:bg-red-500 hover:text-white">
                                        Freeze Account
                                    </button>
                                </li>
                                <li className="py-2">
                                    <button className="border-2 px-5 py-1 rounded-md border-red-500 hover:bg-red-500 hover:text-white"
                                        onClick={() => {
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Are you sure?',
                                                text: 'This action cannot be undone.',
                                                backdrop: true,
                                                showConfirmButton: false,
                                                showDenyButton: true,
                                                showCancelButton: true,
                                                denyButtonText: 'Delete',
                                                preDeny: () => {
                                                    return fetch(`/api/user/delete`, {
                                                        method: "POST",
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify({ uid: user.uid })
                                                    }).then(res => { return res.json() })
                                                    .catch(err => console.error(err))
                                                },
                                                allowOutsideClick: () => !Swal.isLoading(),
                                            }).then((result) => {
                                                console.log('result2',result)
                                                if (result.isDenied && result.value.success === false) {
                                                    return Swal.fire({
                                                        title: 'Oops!',
                                                        text: `An error occurred: ${result?.value?.msg || ''}`,
                                                        icon: 'error',
                                                        showConfirmButton: false,
                                                        showCancelButton: true,
                                                        cancelButtonText: 'Ok',
                                                        allowOutsideClick: false,
                                                    })
                                                }else if(result.isDenied && result.value.success){
                                                    return Swal.fire({
                                                        title: 'We\'re sorry to see you go',
                                                        text: `Your account has been deleted and your posts were removed.`,
                                                        icon: 'success',
                                                        allowOutsideClick: false,
                                                    })
                                                }
                                            }).then((result) => {
                                                console.log(result)
                                                if(result.isConfirmed){
                                                    fetch('/api/auth/logout', { method: "POST" })
                                                    .then(res => res.json)
                                                    .then(data => {
                                                        if(!data.isLoggedIn){
                                                            sessionStorage.clear()
                                                            Router.push("/login")
                                                        }
                                                    })
                                                    .catch(err => console.error(err))
                                                }
                                            }).catch((err) => {
                                                console.log('An error occurred while deleting the user!', err)
                                            })
                                        }}
                                    >
                                        Delete Account
                                    </button>
                                </li>
                            </ul>
                        </div>    
                    ) : page === 1 ? (
                        <>
                        </>
                    ) : page === 2 ? (
                        <>
                        </>
                    ) : page === 3 ? (
                        <>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>

                <Footer></Footer>
            </div>
        </>
    )
}