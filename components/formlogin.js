import Link from 'next/link'
import { useState } from 'react'


export default function LoginForm({ errorMessage, onSubmit }){
    const [loading, setLoading] = useState("hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white")

    return (
      <div className="mx-auto h-full rounded drop-shadow-xl bg-violet-100 w-1/3 px-5 py-20 flex items-center">
        <form onSubmit={ onSubmit } className="w-full flex flex-col p-5 font-kelly text-slate-600">
          <h1 className="font-dongji mb-5 mx-auto text-3xl text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-bold">LOGIN</h1>

          <label className="w-1/2 mx-auto">Username/Email:</label>
          <input className={ errorMessage==="" ? "w-1/2 mx-auto border-2 border-slate-500 rounded mb-3" : "w-1/2 mx-auto border-2 border-rose-500 rounded mb-3" } type="text" name="username" />
          

          <label className="w-1/2 mx-auto">Password:</label>
          <input className={ errorMessage==="" ? "w-1/2 mx-auto border-2 border-slate-500 rounded mb-3" : "w-1/2 mx-auto border-2 border-rose-500 rounded mb-3" } type="password" name="password" />
          

          <button onClick={() => setLoading("animate-spin -ml-1 mr-3 h-5 w-5 text-white")} className="mt-2 w-1/6 mx-auto duration-200 bg-emerald-400 text-white py-1 px-3 border-2 border-emerald-400 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black flex justify-center items-center" type="submit">
            <svg className={ errorMessage==="" ? loading : "hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white" } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Login
          </button>

          {errorMessage && <p className="mx-auto error mt-5 text-rose-500 font-bold">{errorMessage}</p>}

          <div className="text-center mt-3">
            <p>No Account? No Problem!</p>
            <Link href="/registration"><a className="text-violet-500">Create an Account</a></Link>
          </div>
          
        </form>
      </div>
    )
}