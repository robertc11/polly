import Link from 'next/link'
import { useState } from 'react'
import Logo from './logo'
import Icon from './icon'


export default function LoginForm({ errorMessage, onSubmit }){
  const [hidden,setHidden] = useState(true)

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex justify-center px-6 my-12">
          <div className="w-full xl:w-3/4 lg:w-11/12 flex">
            <div className="w-full h-auto bg-gradient-to-l from-violet-400 to-indigo-800 hidden lg:block lg:w-1/2 bg-cover rounded-l-lg">
              <div className="h-full flex flex-col justify-center items-center relative">
                <div className="left-0 top-0 absolute flex items-center">
                  <Icon size={85} />
                  <span className="-ml-3"><Logo theme={'light'} /></span>
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
                  <div className="relative">
                    <input
                      className={errorMessage===""?"w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline":"w-full px-3 py-2 text-sm leading-tight text-gray-700 border border-rose-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline"}
                      name="password"
                      type={hidden? "password" : "text"}
                      placeholder="Enter Password..."
                    />
                    <button type="button" className="absolute inset-y-0 right-3" onClick={() => setHidden(!hidden)}>
                      { hidden ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="gray" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="gray" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mb-2 text-center">
                  <button
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

