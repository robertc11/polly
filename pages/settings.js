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
    const [message, setMessage] = useState([0,''])


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
                            <li className={page===0 ? "py-5 px-5 flex align-center items-center gap-2 text-violet-500" : "py-5 px-5 flex align-center items-center gap-2"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                                <button onClick={() => setPage(0)}>Account Settings</button>
                            </li>
                            <li className={page===1 ? "py-5 px-5 flex align-center items-center gap-2 text-violet-500" : "py-5 px-5 flex align-center items-center gap-2"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                <button onClick={() => setPage(1)}>Password Settings</button>  
                            </li>
                            <li className={page===2 ? "py-5 px-5 flex align-center items-center gap-2 text-violet-500" : "py-5 px-5 flex align-center items-center gap-2"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <button onClick={() => setPage(2)}>Email Settings</button>
                            </li>
                            <li className={page===3 ? "py-5 px-5 flex align-center items-center gap-2 text-violet-500" : "py-5 px-5 flex align-center items-center gap-2"}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
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
                        <div className="px-5 py-5 bg-white flex-1 border-l-[3px] border-slate-300 pb-10">
                            <h1 className="text-3xl font-semibold">Password Center</h1>
                            <br />
                            <button 
                                className="border-2 px-5 py-1 rounded-md border-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => {
                                    fetch('/api/user/passwordreset', {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ uid: user.uid }),
                                    }).then(res => res.json())
                                    .then(data => {
                                        if(data.success){
                                            setMessage([1,'Please check your email for steps to reset your password!'])
                                        }else{
                                            throw "Error generating reset token"
                                        }
                                    })
                                    .catch(err => {
                                        console.error(err)
                                        setMessage([0,'We\'re sorry, something went wrong - please try again later!'])
                                    })
                                }}
                            >
                                Reset Password
                            </button>
                            <p className={message[0] == 1 ? 'text-emerald-400 mt-3' : 'text-rose-500 mt-3'}>{message[1]}</p>
                        </div>
                    ) : page === 2 ? (
                        <div className="px-5 py-5 bg-white flex-1 border-l-[3px] border-slate-300 pb-10">
                            <h1 className="text-3xl font-semibold">Email Settings</h1>
                        </div>
                    ) : page === 3 ? (
                        <div className="px-5 py-5 bg-white flex-1 border-l-[3px] border-slate-300 pb-10">
                            <h1 className="text-3xl font-semibold">Alert Preferences</h1>
                        </div>
                    ) : (
                        <div className="px-5 py-5 bg-white flex-1 border-l-[3px] border-slate-300 pb-10">
                            <h1 className="text-3xl font-semibold">Page Not Found</h1>
                        </div>
                    )}
                </div>

                <Footer></Footer>
            </div>
        </>
    )
}