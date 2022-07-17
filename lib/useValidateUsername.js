import { useState, useEffect } from "react"

export default function useValidateUsername(text){
    const [valid, setValid] = useState(null)

    useEffect(() => {
        try{   
            if(text.trim()==='' || text===undefined || text===null){
                console.log('> useValidateUsername.js: Invalid Username Input')
                return
            }

            const body = {
                usernameInput: text.toLowerCase().trim(),
            }

            //console.log('this is the input to the api poop', body)

            fetch('/api/web/validateusername', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }).then(res => res.json())
            .then(data => {
                //console.log('tittyies',data)
                setValid(data)
            }).catch((err) => {
                //console.log('fuck it failed')
                console.error(err)
            })
            
            
        }catch(e){
            console.error(e)
        }
    }, [text])

    return valid
}