import Head from "next/head"
import { getResetCode } from "../../lib/redis-auth/sessions"
import NavBar from "../../components/navbar"
import { useState } from "react"
import Router from "next/router"

export async function getServerSideProps(context){
    const { uid } = context.query

    const validPage = await getResetCode(uid)
    if(!validPage.success){
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: { 
            uid: uid,
            pin: validPage.reset_code,
        }
    }
} 
export default function VerifyPasswordReset({ uid, pin }){
    const [errorMessage, setErrorMessage] = useState('')
    const [pinSuccess, setPinSuccess] = useState(false)
    const handleSubmit = () => {
        console.log('this is the pin', inputPin, pin)
        if(inputPin.join('') === pin){
            setPinSuccess(true)
        }else{
            setErrorMessage("Sorry, that pin is incorrect.")
        }
    }
    
    const [inputPin, setInputPin] = useState([])
    const handleChange = (e) => {
        setErrorMessage('')
        const { maxLength, value, name } = e.target
        const [fieldName, fieldIndex] = name.split('-')

        if(value.length >= maxLength){
            inputPin[parseInt(fieldIndex)-1] = value
            if(parseInt(fieldIndex, 10) < 6){
                const nextSibling = document.querySelector(`input[name=pin-${parseInt(fieldIndex, 10) + 1}]`)
                if (nextSibling !== null) {
                    nextSibling.focus();
                }
            }else{
                handleSubmit()
            }
        }
    }

    const [pass1, setPass1] = useState('')
    const [pass2, setPass2] = useState('')
    const isPassValid = (pass1 === pass2)

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const disabledClasses = ['cursor-not-allowed', 'animate-pulse', 'pointer-events-none']
        disabledClasses.map(item => document.getElementById("submitbtn").classList.toggle(item))

        let pass = e.currentTarget.password.value
        let passconf = e.currentTarget.passwordconfirm.value

        if(pass !== passconf) return

        fetch('/api/user/passwordreset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uid: uid, newPass: pass}),
        }).then(res => res.json())
        .then(data => {
            if(data.success){
                fetch('/api/auth/logout', { method: "POST" })
                .then(res => res.json)
                .then(data => {
                    if(!data.isLoggedIn){
                        sessionStorage.clear()
                        Router.push("/login")
                    }
                })
                .catch(err => console.error(err))
            }else{
                setErrorMessage("An error occurred while resetting your password.")
            }
        })
        .catch(err => {
            console.error(err)
            disabledClasses.map(item => document.getElementById("submitnewpost").classList.toggle(item))
        })

        
    }

    if(!pinSuccess){
        return (
            <>
                <Head>
                    <title>Password Reset</title>
                </Head>

                <NavBar />
                
                <div className="w-1/2 mx-auto font-dongji">
                    <h1 className="text-center text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 z-10">Please Enter Your Pin</h1>
                    <p className="text-center mb-5 mt-1">Your pin can be found in your email on file. Make sure to check your spam!</p>
                    <div className="bg-violet-100 p-5 w-full rounded flex gap-1 justify-center">
                        <input name="pin-1" onChange={handleChange} type="text" maxLength={1} className="w-12 h-12 text-center rounded-md text-3xl border-2 border-violet-400 ring-1 ring-violet-400"/>
                        <input name="pin-2" onChange={handleChange} type="text" maxLength={1} className="w-12 h-12 text-center rounded-md text-3xl border-2 border-violet-400 ring-1 ring-violet-400"/>
                        <input name="pin-3" onChange={handleChange} type="text" maxLength={1} className="w-12 h-12 text-center rounded-md text-3xl border-2 border-violet-400 ring-1 ring-violet-400"/>
                        <input name="pin-4" onChange={handleChange} type="text" maxLength={1} className="w-12 h-12 text-center rounded-md text-3xl border-2 border-violet-400 ring-1 ring-violet-400"/>
                        <input name="pin-5" onChange={handleChange} type="text" maxLength={1} className="w-12 h-12 text-center rounded-md text-3xl border-2 border-violet-400 ring-1 ring-violet-400"/>
                        <input name="pin-6" onChange={handleChange} type="text" maxLength={1} className="w-12 h-12 text-center rounded-md text-3xl border-2 border-violet-400 ring-1 ring-violet-400"/>
                    </div>
                    <p className="text-rose-400 text-center">{errorMessage}</p>
                </div>
            </>
        )    
    }else{
        return (
            <>
                <Head>
                    <title>Password Reset</title>
                </Head>

                <NavBar />
                
                <div className="w-1/2 mx-auto font-dongji">
                    <h1 className="text-center text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 z-10 mb-5">Enter Your New Password</h1>
                    <form className="bg-violet-100 p-5 w-full rounded flex flex-col items-center" onSubmit={handleFormSubmit}>
                        <div className="w-1/2 mx-auto">
                            <label className="w-full"><span className="text-pink-600">*</span>New Password: <span className="italic text-pink-600 text-sm">required</span></label>          
                            <input className="rounded border-2 border-violet-300 w-full mb-3 invalid:mb-0 invalid:border-2 invalid:border-pink-600 peer p-1" type="password" name="password" placeholder=" your password here" pattern="(?=.*\d)(?=.*[a-z]).{8,}" value={pass1} onChange={e => setPass1(e.target.value)} required />
                            <p className="hidden peer-invalid:block text-pink-600 text-sm w-full mb-3">Passwords must be at least 8 characters and at least one digit!</p>
                        </div>
                        
                        <div className="w-1/2 mx-auto">
                            <label className="w-full mx-auto"><span className="text-pink-600">*</span>Confirm New Password: <span className="italic text-pink-600 text-sm">required</span></label> 
                            <input className={isPassValid?"rounded border-2 border-violet-300 w-full mx-auto mb-5 p-1":"rounded border-2 border-violet-300 w-full mx-auto p-1"} type="password" name="passwordconfirm" placeholder=" confirm your password" value={pass2} onChange={e => setPass2(e.target.value)} required />
                            <p className={isPassValid? "hidden":"text-sm w-full mx-auto mb-5 text-pink-600"}>Passwords do not match.</p>
                        </div>

                        <input type="submit" id="submitbtn" className="rounded py-1 px-3 text-center bg-violet-500 text-white cursor-pointer" value="Change Password"/>
                    </form>
                </div>
            </>
            
        )
    }
    
}