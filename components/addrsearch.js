import usePlacesAutocomplete from '../lib/usePlacesAutocomplete'
import { useState } from 'react'
import googleLogo from '../public/powered_by_google_on_white.png'
import Image from 'next/image'

export default function AddrSearch(props){
    // google maps search and autocomplete
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
      setSelectedPrediction(prediction) // handles the local search val
      props.handleSelection(prediction) // passes addr up to be used in map
    }

    return (
        <>
            <div className="pt-2 mb-2 relative mx-auto text-gray-600 w-7/12 group">
                <input className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none focus:border-sky-300 peer"
                    type="search" name="streetaddress" placeholder="Search address" value={selectedPrediction===null?searchValue:selectedPrediction.structured_formatting.main_text} 
                    onChange={(e) => handleSearch(e, e.target.value)} autoComplete="off"
                />
                <ul className="hidden rounded-b-md inset-x-0 border-b-2 border-slate-500 z-10 text-black bg-white absolute peer-focus:block group-hover:block">
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
                
                <button type="button" onClick={() => console.log('run address search for map!')} className="absolute right-0 top-0 mt-5 mr-4 peer-focus:text-sky-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" x="0px" y="0px" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            </div>

            {/* <h3>Predictions: {JSON.stringify(predictions)}</h3> */}
            {/* <h3>You searched for: {searchValue}</h3>
            <h3>
                You selected:{" "}
                {selectedPrediction?.structured_formatting?.main_text || "None"}
            </h3> */}
        </>
    )
}