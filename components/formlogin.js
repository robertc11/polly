import Link from 'next/link'
import { useState } from 'react'
import Logo from './logo'


export default function LoginForm({ errorMessage, onSubmit }){
    const [loading, setLoading] = useState("hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white")

    return (
      <div>
        <div className="container mx-auto">
          <div className="flex justify-center px-6 my-12">
            <div className="w-full xl:w-3/4 lg:w-11/12 flex">
              <div className="w-full h-auto bg-gradient-to-l from-violet-400 to-indigo-800 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg">
                <div className="h-full flex flex-col justify-center items-center relative">
                  <div className="left-5 top-5 absolute">
                    <Link href="/"><a><Logo theme="light" /></a></Link>
                  </div>
                  <p className="text-white text-2xl p-5 text-center">Sign in to connect with your community and make a difference.</p>

                </div>
                
                
              </div>
              <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none border-y-2 border-r-2">
                <div className="px-8 mt-2 text-left">
                  <h1 className="font-dongji pt-4 mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-800">Sign In</h1>
                </div>
                <form onSubmit={onSubmit} className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      Username or Email
                    </label>
                    <input
                      className={errorMessage===""?"w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline mb-3":"w-full px-3 py-2 text-sm leading-tight text-gray-700 border border-rose-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline mb-3"}
                      name="username"
                      type="text"
                      placeholder="Enter Email Address..."
                    />
                    <label className="block mb-2 text-sm font-bold text-gray-700">
                      Password
                    </label>
                    <input
                      className={errorMessage===""?"w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline":"w-full px-3 py-2 text-sm leading-tight text-gray-700 border border-rose-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline"}
                      name="password"
                      type="password"
                      placeholder="Enter Password..."
                    />
                  </div>
                  <div className="mb-2 text-center">
                    <button
                      onClick={() => setLoading("animate-spin -ml-1 mr-3 h-5 w-5 text-white")}
                      className="w-full px-4 py-2 font-bold text-white bg-violet-500 rounded-full hover:bg-violet-700 focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>
                  {errorMessage && 
                    <div className="text-center mb-2">
                      <p
                        className="inline-block text-sm text-rose-500 align-baseline"
                      >
                        {errorMessage}
                      </p>
                    </div>
                  }
                  
                  <hr className="mb-6 border-t" />
                  <div className="text-center">
                    <Link href="/registration"><a
                      className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    >
                      Create an Account!
                    </a></Link>
                  </div>
                  <div className="text-center">
                    <Link href="/"><a
                      className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
                    >
                      Forgot your Password?
                    </a></Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}