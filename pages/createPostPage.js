import { useEffect, useState, useRef } from 'react'
import { Wrapper } from "@googlemaps/react-wrapper"
import * as React from 'react'
import Marker from "../components/marker"
import Map from '../components/map'
import useUser from '../lib/useUser'
import Router from 'next/router'
import { getCurrentUnix } from '../lib/timestamp'
import fetchJson from '../lib/fetchJson'
import Script from 'next/script'
import Head from 'next/head'

export default function CreatePostPage(){
    const { user, mutateUser } = useUser({  // only logged in users can create posts
        redirectTo: "/login",
    })

    const [error, setError] = useState('')
    
    // google maps data
    const [clicks, setClicks] = useState([])
    const [center, setCenter] = useState({lat: 33.021526, lng: -96.709848})
    const [zoom, setZoom] = useState(12)

    const onClick = (e) => {
        setClicks([e.latLng])
    }

    const onIdle = (m) => {
        setZoom(m.getZoom())
        setCenter(m.getCenter())
    }

    // post submission data
    const [toggleMap, setToggleMap] = useState(false)
    const handleToggle = (e) => {
        setToggleMap(!toggleMap)
    }

    // form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault()

        //console.log('yooo',typeof(clicks[0]),typeof(clicks[0].lat()), typeof(clicks[0].lng()), clicks[0].lat(), clicks[0].lng(), clicks[0])
        const body = {
            upvotes: 1,
            downvotes: 0,
            statement: e.currentTarget.title.value,
            map: (clicks.length > 0)?true:false,
            mapLink: (clicks.length > 0)?generateLink(clicks[0].lat(),clicks[0].lng()):'',
            city: user.cityID[3],
            timestamp: getCurrentUnix(),
            body: e.currentTarget.textContent.value,
            user: user,
        }

        console.log("processing data and submitting!", body)

        try{
            const res = await fetchJson('api/posts/createpost', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            })

            if(res.success){
                Router.push('/web?page=bulletins')
            }
            else{
                setError(res.msg)
            }
        }catch(err){
            setError(err.message)
        }
    }

    const generateLink = (lat,lng) => {
        const plusCode = OpenLocationCode.encode(lat, lng)
        plusCode = plusCode.replace('+','%2B')
        const link = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo&q=${plusCode}`
        return link
    }

    return (
        <>
            <Script
                src={"https://cdn.jsdelivr.net/openlocationcode/latest/openlocationcode.min.js"}
            >    
            </Script>

            <Head>
                <title>New Post</title>
            </Head>

            <h1 className="mt-10 text-center font-dongji text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">Your Shiny New Post</h1>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <label className="w-2/3 mx-auto mt-3">Your Title:</label>
                <input id="title" className="w-2/3 mx-auto border-2 border-slate-400 rounded-sm p-1" 
                    type="text"
                    name="title"
                    placeholder=" I love kitties!" 
                />

                <label className="w-2/3 mx-auto mt-3">Tell Us More:</label>
                <textarea id="body" className="w-2/3 mx-auto border-2 border-slate-400 rounded-sm p-1" 
                    type="text" 
                    name="textContent"
                    placeholder=" My cats love..."
                />
                
                <div className="w-2/3 mx-auto mt-5 mb-5">
                    <input type="checkbox" name="mapOpener" onChange={() => handleToggle()} ></input>
                    <label htmlFor="mapOpener"> Add a Location</label>
                </div>

                <div className={toggleMap? null : "hidden"}>
                    <hr className="mb-3 text-slate-600 w-3/4 mx-auto"></hr>
                    <p className="w-2/3 mx-auto">Click on the map to select a location or <button type="button" className="underline text-sky-500" onClick={() => setClicks([])}>clear the map</button>:</p>
                    <Wrapper apiKey={"AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo"}>
                        <Map
                            center={center}
                            onClick={onClick}
                            onIdle={onIdle}
                            zoom={zoom}
                        >
                            {clicks.map((latLng, i) => (
                                <Marker key={i} position={latLng} />
                            ))}
                        </Map>
                    </Wrapper>   
                </div>

                {clicks.map((latLng, i) => (
                    <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
                ))}
                
                <p className={error===''?"hidden":"text-center w-full text-red-500"}>{error}</p>

                <div className="w-full flex items-center justify-center mt-3 mb-10 text-slate-600">
                    <button type="submit" className="w-1/6 mt-3 px-1 py-2 bg-emerald-300 rounded-md mr-1">Create!</button>
                    <button type="button" className="w-1/6 mt-3 px-1 py-2 bg-slate-300 rounded-md ml-1" onClick={() => Router.push("/web?page=bulletins")}>Cancel</button>                           
                </div>
            </form>
            
        </>
    )
}