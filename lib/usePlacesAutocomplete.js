import { useState, useEffect } from "react";
import { googleAutocomplete } from "../pages/api/web/googleAutocomplete";

export default function usePlacesAutocomplete(text='', debounceTimeout=400){
    const [predictions, setPredictions] = useState([])

    useEffect(() => {
        const handleDebounce = setTimeout(async () => {
            try{
                if(!text){
                    //console.log("AUTO NO TEXT")
                    return 'NO TEXT'
                }

                googleAutocomplete(text).then((res) => {
                    //console.log('google passed result',res)
                    setPredictions(res)
                })

            }catch(e){
                console.error(e)
            }
        }, debounceTimeout)

        return () => {
            clearTimeout(handleDebounce)
        }
    }, [text, debounceTimeout])

    //console.log("AUTO",predictions)
    return predictions
}
