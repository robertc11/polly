// File not in use but here for reference until I delete it

export const googleAutocomplete = async text => {
    return new Promise((resolve, reject) => {
        if(!text){
            return reject("Invalid Text Input")
        }

        if(typeof window === "undefined"){
            return reject("Invalid Window Object")
        }

        try{
            console.log('text going to google!', text)
            var service = new window.google.maps.places.AutocompleteService()
            service.getPlacePredictions(
                {input: text, componentRestrictions: {country: "US"} },
                function(predictions, status){
                    console.log('this is google result', predictions)
                    resolve(predictions)
                }
            )
            console.log("resolved")
        }catch(e){
            console.log("ISSUE in google auto")
            reject(e)
        }
    })
}