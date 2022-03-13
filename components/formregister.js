// React Imports
import { useState } from 'react'

// lib Imports
import usePlacesAutocomplete from '../lib/usePlacesAutocomplete'
import useValidateUsername from '../lib/useValidateUsername'

// Next Imports
import Head from 'next/head'
import Image from 'next/image'
import Script from 'next/script'

// Img Imports
import googleLogo from '../public/powered_by_google_on_white.png'


export default function RegistrationForm({ errorMessage, onSubmit }) {
  const [formScr, setFormScr] = useState(0)

  // google maps autocomplete states
  const [selectedPrediction, setSelectedPrediction] = useState(null)
  const [searchValue, setSearchValue] = useState('')
  const predictions = usePlacesAutocomplete(searchValue)

  const handleSearch = (e, value) => {
    e.preventDefault
    setSelectedPrediction(null)
    setSearchValue(value) 
  }
  
  const handlePredictionSelection = (e, prediction) => {
    e.preventDefault()
    setSelectedPrediction(prediction)
  }

  //username validation states
  const [usernameValue, setUsernameValue] = useState('')
  const isUsernameValid = useValidateUsername(usernameValue)

  //password validation states
  const [pass1, setPass1] = useState('')
  const [pass2, setPass2] = useState('')
  const isPassValid = (pass1 === pass2)


  return(
    <>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo&language=en&libraries=places"
      ></Script>

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
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1" type="text" name="firstname" placeholder=" Jason" required />
          
          <label className="w-1/2 mx-auto">Last Name:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1" type="text" name="lastname" placeholder=" Smith" required />
          
          <div className="w-1/2 mx-auto">
            <label className="w-full">Email Address:</label> {/* email must be sent in lowercase!!!! */}
            <input className="rounded border-2 border-violet-300 w-full mb-3 invalid:mb-0 invalid:border-2 invalid:border-pink-600 peer p-1" type="email" name="email" placeholder=" jsmith@gmail.com" required />
            <p className="hidden peer-invalid:block text-pink-600 text-sm w-full mb-3">Please provide a valid email address.</p>  
          </div>
          
          
          <div className="w-1/2 mx-auto">
            <label className="w-full">Phone #:</label>
            <input className="rounded border-2 border-violet-300 w-full mb-3 invalid:mb-0 invalid:border-2 invalid:border-pink-600 peer p-1" type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder=" 555-555-5555" />
            <p className="hidden peer-invalid:block text-pink-600 text-sm w-full mb-3">Please follow the format xxx-xxx-xxxx.</p>  
          </div>
          

          <button className="p-5 text-slate-600 hover:animate-pulse mx-auto" onClick={() => setFormScr(formScr+1)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

        </div>
        
        <div className={ formScr===2 ? "flex flex-col w-full animate-fadedongji" : "hidden flex flex-col" }>
          <h1 className="font-dongji mb-5 mx-auto text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 font-bold">Street Address</h1>
          
          <div className="w-1/2 mx-auto relative mb-3">
            <label className="w-full">Street Address:</label>
            <div className="group" tabIndex={0}>
              <input className="rounded border-2 border-violet-300 w-full peer p-1" type="text" name="streetaddress" placeholder=" 550 S. Watters Rd" value={selectedPrediction===null?searchValue:selectedPrediction.structured_formatting.main_text} onChange={(e) => handleSearch(e, e.target.value)} autoComplete="off" required />
              <ul className="hidden rounded-b-md inset-x-0 border-b-2 border-slate-500 text-black bg-white absolute peer-focus:block group-hover:block">
                {predictions?.map(prediction => (
                  <li className="p-1 border-x-2 border-slate-500 hover:bg-sky-100 hover:block focus:block active:block" key={prediction?.place_id}>
                    <button
                      className="w-full text-left hover:block focus:block active:block"
                      onClick={(e) => handlePredictionSelection(e, prediction)}
                      onKeyDown={(e) => handlePredictionSelection(e, prediction)}
                      key={prediction?.place_id}
                    >
                      {prediction?.description.slice(0,-5) || "Not Found"}
                    </button>
                  </li>
                ))}

                <div className="flex flex-row-reverse relative border-x-2 border-slate-500 w-full py-1 pr-3 ">
                  <Image src={googleLogo} />  
                </div>
              </ul>  
            </div>
            
          </div>
          {/* <h3>Predictions: {JSON.stringify(predictions)}</h3> */}
          {/* <h3>You searched for: {searchValue}</h3>
          <h3>
            You selected:{" "}
            {selectedPrediction?.structured_formatting?.main_text || "None"}
          </h3> */}

          <label className="w-1/2 mx-auto">City:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1" type="text" name="city" placeholder=" Allen" defaultValue={selectedPrediction?.structured_formatting?.secondary_text.split(',')[0].trim() || ""} autoComplete="off" required />
          

          <label className="w-1/2 mx-auto">State:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1" type="text" name="state" placeholder=" TX/Texas" defaultValue={selectedPrediction?.structured_formatting?.secondary_text.split(',')[1].trim() || ""} autoComplete="off" required />
          

          <label className="w-1/2 mx-auto">Postal Code:</label>
          <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1" type="text" name="zipcode" placeholder=" 75080" required />
          

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
          
          {/* <h3>isUsernameValid: {isUsernameValid}</h3> */}

          <label className="w-1/2 mx-auto">Username:</label>
          <input className={(isUsernameValid??true) ? "rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1":"rounded border-2 border-violet-300 w-1/2 mx-auto p-1"} type="text" name="username" placeholder=" kittenlover21" value={usernameValue} onChange={e => setUsernameValue(e.target.value)} autoComplete="off" required />
          <p className={(isUsernameValid??true) ? "hidden" : "w-1/2 mx-auto text-sm text-pink-600 mb-3"}>This username is already taken!</p>

          <div className="w-1/2 mx-auto">
            <label className="w-full">Password:</label>          
            <input className="rounded border-2 border-violet-300 w-full mb-3 invalid:mb-0 invalid:border-2 invalid:border-pink-600 peer p-1" type="password" name="password" placeholder=" your password here" pattern="(?=.*\d)(?=.*[a-z]).{8,}" value={pass1} onChange={e => setPass1(e.target.value)} required />
            <p className="hidden peer-invalid:block text-pink-600 text-sm w-full mb-3">Passwords must be at least 8 characters and at least one digit!</p>
          </div>
          

          <label className="w-1/2 mx-auto">Confirm Password:</label> 
          <input className={isPassValid?"rounded border-2 border-violet-300 w-1/2 mx-auto mb-5 p-1":"rounded border-2 border-violet-300 w-1/2 mx-auto p-1"} type="password" name="passwordconfirm" placeholder=" confirm your password" value={pass2} onChange={e => setPass2(e.target.value)} required />
          <p className={isPassValid? "hidden":"text-sm w-1/2 mx-auto mb-5 text-pink-600"}>Passwords do not match.</p>
          
          <button
            className="mx-auto w-1/6 duration-200 bg-emerald-400 text-white py-1 border-2 border-emerald-400 rounded-lg hover:bg-white hover:text-black hover:border-2 hover:border-black flex justify-center items-center" 
            type="submit"
          >
            Create Account
          </button>

          {errorMessage && <p className="mx-auto error mt-5 text-rose-500 font-bold">{errorMessage}</p>}

          <button className="text-slate-600 hover:animate-pulse mx-auto p-4" onClick={() => setFormScr(formScr-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
            </svg>
          </button>

        </div>
        
      </form>
    </>
  )
}