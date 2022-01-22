// React Imports
import { useState } from 'react'

// Component Imports
import BlockX from './blockX'

// Next Imports
import Link from 'next/link'

export default function Form({ screen, errorMessage, onSubmit }) {
  const [loading, setLoading] = useState("hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white")
  const [formScr, setFormScr] = useState(0)

  if(screen === 'login'){
    return (
      <div className="rounded-lg mx-auto shadow-lg bg-violet-100 w-1/2 p-5">
        <form onSubmit={ onSubmit } className="w-full flex flex-col p-5 font-kelly text-slate-600">
          <h1 className="font-dongji mb-5 mx-auto text-3xl text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-bold">LOGIN</h1>

          <label className="w-1/2 mx-auto">Username/Email:</label>
          <input className={ errorMessage==="" ? "w-1/2 mx-auto border-2 border-slate-500 rounded mb-3" : "w-1/2 mx-auto border-2 border-rose-500 rounded mb-3" } type="text" name="username" />
          

          <label className="w-1/2 mx-auto">Password:</label>
          <input className={ errorMessage==="" ? "w-1/2 mx-auto border-2 border-slate-500 rounded mb-3" : "w-1/2 mx-auto border-2 border-rose-500 rounded mb-3" } type="password" name="password" />
          

          <button onClick={() => setLoading("animate-spin -ml-1 mr-3 h-5 w-5 text-white")} className="mt-2 w-1/6 mx-auto duration-200 bg-emerald-400 text-white py-1 px-3 border-2 border-emerald-400 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black flex justify-center items-center" type="submit">
            <svg className={ errorMessage==="" ? loading : "hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white" } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
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
  }else if(screen === 'register'){
    return(
      <form onSubmit={ onSubmit } className="w-full p-5 flex flex-col justify-center items-center font-kelly text-slate-600">
        
        <div className={ formScr===0 ? "flex flex-col justify-center items-center animate-fadedongji w-full" : "hidden flex flex-col justify-center items-center w-full" }>
          <h1 className="mt-10 mb-5 text-5xl text-transparent w-full text-center bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-700 font-bold">Hello.</h1>
          <h1 className="mb-5 text-xl peer">Let's get started...</h1>
          <button className="text-slate-600 hover:animate-pulse peer-hover:animate-pulse" onClick={() => setFormScr(formScr+1)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <div className={ formScr===1 ? "flex flex-col w-full animate-fadedongji" : "hidden flex flex-col" }>
          <h1 className="font-dongji mb-5 mx-auto text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-bold">Personal Information</h1>
          
          <label className="w-1/2 mx-auto">First Name:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="firstname" placeholder=" Jason" required />
          
          <label className="w-1/2 mx-auto">Last Name:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="lastname" placeholder=" Smith" required />
          
          <label className="w-1/2 mx-auto">Email Address:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="lastname" placeholder=" jsmith@gmail.com" required />
          
          <label className="w-1/2 mx-auto">Phone #:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="lastname" placeholder=" 555-555-5555" />
          
          <button className="p-5 text-slate-600 hover:animate-pulse mx-auto" onClick={() => setFormScr(formScr+1)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

        </div>
        
        <div className={ formScr===2 ? "flex flex-col w-full animate-fadedongji" : "hidden flex flex-col" }>
          <h1 className="font-dongji mb-5 mx-auto text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-bold">Street Address</h1>
          
          <label className="w-1/2 mx-auto">Street Address:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="street-address" placeholder=" 550 S. Watters Rd" autoComplete="off" required />
          

          <label className="w-1/2 mx-auto">City:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="city" placeholder=" Allen" required />
          

          <label className="w-1/2 mx-auto">State:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="state" placeholder=" TX/Texas" required />
          

          <label className="w-1/2 mx-auto">Postal Code:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="zipcode" placeholder=" 75080" required />
          

          <span className="p-5 mx-auto">
            <button className="mr-5 text-slate-600 hover:animate-pulse" onClick={() => setFormScr(formScr-1)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
              </svg>
            </button>

            <button className="text-slate-600 hover:animate-pulse" onClick={() => setFormScr(formScr+1)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </span>
        
        </div>

        <div className={ formScr===3 ? "flex flex-col w-full animate-fadedongji" : "hidden flex flex-col" }>
          <h1 className="mb-5 text-2xl mx-auto text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-bold">Account Information</h1>
          
          <label className="w-1/2 mx-auto">Username:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="username" placeholder=" kittenlover21" required />
          
          <label className="w-1/2 mx-auto">Password:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3" type="text" name="password" placeholder=" your password here" required />

          <label className="w-1/2 mx-auto">Confirm Password:</label> 
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-5" type="text" name="passwordconfirm" placeholder=" confirm your password" required />
           
          <button onClick={() => {
              setLoading("animate-spin -ml-1 mr-3 h-5 w-5 text-white")
            }}
            className="mx-auto w-1/6 duration-200 bg-emerald-400 text-white py-1 border-2 border-emerald-400 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black flex justify-center items-center" 
            type="submit"
          >
            <svg className={ errorMessage==="" ? loading : "hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white" } xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Create Account
          </button>

          <button className="text-slate-600 hover:animate-pulse mx-auto p-4" onClick={() => setFormScr(formScr-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>

        </div>
        
      </form>
    )
  }else{
    return(
      <p className="text-center">Error: Incorrect Props Passed</p>
    )
  }
}