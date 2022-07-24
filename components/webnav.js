import Link from "next/link"
import Logo from './logo'
import Router from "next/router"

export default function Webnav({user, redirect}){
    return (
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
                <Link href={redirect || '/'}><a><Logo theme={"light"} /></a></Link>
                <h1 className="text-2xl text-white">｜</h1>
                <Link href='/settings'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </Link>
                
                <h1 className="text-2xl text-white">｜</h1>
                <a className="font-bold text-white mr-5 text-lg cursor-pointer"
                    onClick={async (e) => {
                        e.preventDefault()
                        
                        // mutateUser(
                        //     await fetchJson("/api/web/logout", { method: "POST" }),
                        //     false,
                        // );

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
                    Logout
                </a>
            </div>
        </div>
    )
}