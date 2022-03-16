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
            console.log('> googleAutocomplete.js: Text going to google: ', text)
            var service = new window.google.maps.places.AutocompleteService()
            service.getPlacePredictions(
                {input: text, componentRestrictions: {country: "US"} },
                function(predictions, status){
                    console.log('> googleAutocomplete.js: This is google result:', predictions)
                    resolve(predictions)
                }
            )
            console.log("> googleAutocomplete.js: Resolved")
        }catch(e){
            console.log("> googleAutocomplete.js: ERROR")
            reject(e)
        }
    })
}