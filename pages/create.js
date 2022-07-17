import { useEffect, useState, useRef, useMemo } from 'react'
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api"
import * as React from 'react'
import useUser from '../lib/useUser'
import Router from 'next/router'
import { getCurrentUnix } from '../lib/timestamp'
import fetchJson from '../lib/fetchJson'
import Script from 'next/script'
import Head from 'next/head'
import styles from '../styles/CreatePostPage.module.css'
import { getGeocode, getLatLng } from "use-places-autocomplete"
import AddrSearch from '../components/addrsearch'
import Link from 'next/link'

import BlockY from '../components/blockY'  // rob ius adding block Y

const LIBS = ["places"]

export default function CreatePostPage() {
    const { user, mutateUser } = useUser({  // only logged in users can create posts
        redirectTo: "/login",
    })




    const [error, setError] = useState('')

    // google maps data
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY,
        libraries: LIBS,
    })
    const [point, setPoint] = useState(null)
    const getSelectedPoint = (value) => {
        setPoint(value)
        console.log("Rob Helper Logs 'setpoint' --- ", setPoint)
    }

    //showHide functionality
    const [ShowHide, setShowHide] = useState(false)
    console.log(ShowHide)
    const [view, setView] =useState(null)
    // post submission data
    //const [toggleMap, setToggleMap] = useState(false)
    const handleMapToggle = (e) => {
        //setToggleMap(!toggleMap)
        //console.log("rob helper logs 'togglemap' ", toggleMap)
        if(view === "map") {
            setView(null) 
        } else {
            setView("map")
        }
    }

    const [activeElement, setActiveElement] = useState(null)
    const [toggleEmojis, setToggleEmojis] = useState(false)
    const handleEmoji = () => {
        const emojis = document.getElementById("emoticons")
        if (toggleEmojis) {
            // need to hide
            emojis.className = styles.exit
        } else {
            // need to show
            emojis.className = "fixed z-50 flex justify-center items-center text-4xl rounded-r border border-gray-300 shadow-lg animate-slideIn"
        }
        setToggleEmojis(!toggleEmojis)
    }
    const addEmoji = (e) => {
        e.preventDefault()
        const emojiToAdd = e.currentTarget.innerText
        console.log(activeElement, emojiToAdd)
        if (activeElement === "input") {
            document.getElementById("title").value = document.getElementById("title").value + " " + emojiToAdd
        } else if (activeElement == "textarea") {
            document.getElementById("body").value = document.getElementById("body").value + " " + emojiToAdd
        } else {
            return
        }
    }

//  ---------------------------------------------------------------START OF ROB MEDIA UPLOAD CODE-------------------------------------------------------------------------------------------------------------------------

    //rob and dongji show/hide




// handling the toggle when attachment icon is clicked
    const [toggleupload, setToggleUpload] = useState(false);
    const [GoogleMapSpy, setGoogleMapSpy] = useState(false)

    const handleuploadtoggle = (e) => {
        setToggleUpload(!toggleupload)

        if(view === "upload") {
            setView(null) 
        } else {
            setView("upload")
        }

     

    }


    // why am I able to see the boolean for toggleupload w/ useeffect and not with the above console log?
    useEffect(() => {
        // console.log("use effect toggle map", toggleMap)
        // console.log("use effect toggle upload", toggleupload)
    })   

    // drop and drag event handler and parse
    useEffect(() => {

        //const dropArea = document.querySelector(".dropbox-class")
        const dropArea = document.getElementById("dropbox")
        dropArea.addEventListener("dragover", (e) => {
            e.preventDefault()
            console.log("I am in the drop area")
        })

        dropArea.addEventListener("dragleave", (e) => {
            console.log("I am leaving the drop area")
        })

        dropArea.addEventListener("drop", drop, false)
        dropArea.addEventListener("dragenter", dragenter, false);
        dropArea.addEventListener("dragover", dragover, false);  

        function drop(e) {
            e.stopPropagation();
            e.preventDefault();
            const dt = e.dataTransfer;
            const files = dt.files;
            //handleAttachments2(files)
            console.log("here are the files", files);
            for (const file of files) {
                let size = file.size
                console.log('file size ---- ', size)}

                // check file type and size 

            fileUpload(files)
        }

        function dragenter(e) {
            e.stopPropagation();
            e.preventDefault();
        }

        function dragover(e) {
            e.stopPropagation();
            e.preventDefault();
        }
    })

    // svg icon calls this and calls the input
    // I need to delay this untill the upload button is selected in the hidden dropzone 

    const handleAttachments2 = (e) => {
        let fileElem = document.getElementById('files');
        if (fileAttachments == true) {
            fileElem.click()
        }
        // if (fileElem) {
        //     fileElem.click()
        // }
    }

    //setup listener before the page initializes with useEffect
    useEffect(() => {
        const fileField2 = document.getElementById('fileSelect');
        fileField2.addEventListener('click', function (e) {
            console.log('I GOT TO handleAttachments2 -- line ~66 ')

        }, false)
    }, [])
    const [fileAttachments, setFileAttachments] = useState(true)

    // This is triggered whren the input element is clicked
    const handleAttachments = (e) => {
        // let eventy = e.target.value
        // console.log(eventy)

        //not sure what the value of this is 
        setFileAttachments(!fileAttachments)
        console.log('fileAttachments', fileAttachments)
        if (fileAttachments == true) {
            console.log(fileAttachments)
            console.log("1")
            //let inputboolean = fileAttachments
            let inputboolean2 = "true"
            fileUpload(null, inputboolean2);
        }

    }

    // main funtion that parse and upload the media
    // change direction of data flow depending on drop vs choose file action
    const fileUpload = (files, inputboolean2) => {
        console.log("input bool party", inputboolean2)
        // if (files.length == 0) {
        //     var files = false
        // }
        if (files > 0) {
            fuHandler(files)
            //console.log("got to fileUpload")
            console.log(fileAttachments)
            console.log("im a file", files)
        } else if (inputboolean2) {
            const fileAttachmentsval = true
            if (fileAttachmentsval == true) {
                console.log('GOT HERE HOORAY!')
                const formData = new FormData();
                const fileField = document.getElementById('files');
                formData.append('username', 'abc123');  //need to get username and append here      
                for (let i = 0; i < fileField.files.length; i++) {
                    formData.append(`fileField_${i}`, fileField.files[i])
                }


                // listener that prints file object
                //  file sniffing to reject bad media data
                fileField.addEventListener("change", (e) => {

                    for (const file of e.target.files) {
                        let size = file.size
                        console.log('file size ---- ', size)
                    }

                    if (size < 3000000) {
                        let selectedfile = e.target.files
                        fuHandler(selectedfile)
                        console.log('selected files ---- ', selectedfile)

                    } else {
                        alert("The selected file is too large")
                    }
                })
            }


        }

    }

    // POST file upload attatchment data to endpoint for Dongji to handle backend operation
    // Captures username and postID to include in POST
    function fuHandler(selectedfile) {
        console.log("we got to our event handler --- its kung fu baby", selectedfile)

        //body
        let attachmentUBody = {

            Name: "",
            File: selectedfile,
            User: "",
            PostID: ""

        }

        if (selectedfile.length > 0) {

            let data = attachmentUBody

            try {
                const furesult = fetch('/api/blogs/blog.api', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'image/jpeg/png'
                    },
                    Body: (data)

                })
                    .then(response => response.json)
                    .then(response)
                console.log(response)
                console.log(furesult)

            } catch (err) {
                console.log(err)
            }

        }



        //console.log(e.currentTarget)
    }

    //---------------------------------------------------------------END OF ROB MEDIA UPLOAD CODE-------------------------------------------------------------------------------------------------------------------------


    const [isAnon, setIsAnon] = useState(false)
    const toggleAnon = () => {
        setIsAnon(!isAnon)
    }

    // form submit handler
    const handleSubmit = async (e) => {
        e.preventDefault()

        //console.log('yooo',typeof(clicks[0]),typeof(clicks[0].lat()), typeof(clicks[0].lng()), clicks[0].lat(), clicks[0].lng(), clicks[0])
        const body = {
            upvotes: 1,
            downvotes: 0,
            statement: e.currentTarget.title.value,
            map: (point !== null) ? true : false,
            mapLink: (point !== null) ? generateLink(point) : '',
            city: user.cityID[3],
            timestamp: getCurrentUnix(),
            body: e.currentTarget.textContent.value,
            anonymous: isAnon,
        }

        console.log("processing data and submitting!", body)

        try {
            const res = await fetchJson('api/posts/createpost', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })

            if (res.success) {
                Router.push('/web?page=bulletins')
            }
            else {
                setError(res.msg)
            }
        } catch (err) {
            setError(err.data.msg)
        }
    }

    const generateLink = (point) => {
        var plusCode = null
        if (typeof (point.lat) === 'number') {
            plusCode = OpenLocationCode.encode(point.lat, point.lng)
        } else if (typeof (point.lat) === 'function') {
            plusCode = OpenLocationCode.encode(point.lat(), point.lng())
        } else {
            return ''
        }
        // const plusCode = OpenLocationCode.encode(lat, lng)
        plusCode = plusCode.replace('+', '%2B')
        const link = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo&q=${plusCode}`
        return link
    }

    return (
        <>
            <Script src={"https://cdn.jsdelivr.net/openlocationcode/latest/openlocationcode.min.js"} />


            <Head>
                <title>New Post</title>
            </Head>

            <div className="relative pb-10">
                <div id="emoticons" className="hidden">
                    <button onClick={addEmoji} className="p-2 hover:bg-gray-200 group">😁
                        <span className="group-hover:block hidden absolute inset-x-0 text-xs mt-2 text-rose-400">{activeElement ? null : "select an input field!"}</span>
                    </button>
                    <button onClick={addEmoji} className="p-2 hover:bg-gray-200 group">😂
                        <span className="group-hover:block hidden absolute inset-x-0 text-xs mt-2 text-rose-400">{activeElement ? null : "select an input field!"}</span>
                    </button>
                    <button onClick={addEmoji} className="p-2 hover:bg-gray-200 group">👍
                        <span className="group-hover:block hidden absolute inset-x-0 text-xs mt-2 text-rose-400">{activeElement ? null : "select an input field!"}</span>
                    </button>
                    <button onClick={addEmoji} className="p-2 hover:bg-gray-200 group">😭
                        <span className="group-hover:block hidden absolute inset-x-0 text-xs mt-2 text-rose-400">{activeElement ? null : "select an input field!"}</span>
                    </button>
                    <button onClick={addEmoji} className="p-2 hover:bg-gray-200 group">❤️
                        <span className="group-hover:block hidden absolute inset-x-0 text-xs mt-2 text-rose-400">{activeElement ? null : "select an input field!"}</span>
                    </button>
                </div>

                <h1 className="mt-10 text-center font-dongji text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 mb-10">Your Shiny New Post</h1>
                <div className="border border-gray-300 w-7/12 mx-auto py-10 shadow-lg rounded-lg" >
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        <label className="w-10/12 mx-auto mt-3">Your Title:</label>
                        <input id="title" className="w-10/12 mx-auto border border-gray-300 rounded-sm p-1 bg-gray-100 outline-none focus:border-violet-400"
                            type="text"
                            name="title"
                            placeholder=" I love kitties!"
                            maxLength="60"
                            onFocus={() => setActiveElement("input")}
                        />

                        <label className="w-10/12 mx-auto mt-3">Tell Us More:</label>
                        <textarea id="body" className="w-10/12 h-28 mx-auto border border-gray-300 rounded-sm p-1 bg-gray-100 outline-none focus:border-violet-400"
                            type="text"
                            name="textContent"
                            placeholder=" My cats love..."
                            maxLength="440"
                            onFocus={() => setActiveElement("textarea")}
                        />

                        <div className="w-10/12 mx-auto flex text-gray-500 m-2">
                            <svg onClick={() => handleMapToggle()} className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <svg onClick={() => handleEmoji()} className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <input type="file" id="files" onClick={() => handleAttachments()} style={{ display: 'none' }} accept='image/*' multiple />
                            <svg onClick={() => handleuploadtoggle()} id='fileSelect' className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                            <div id='preview'></div>

                        </div>


                        <div className={view === "map" ? null : "hidden"}>

                            {/* <div className={toggleMap? null : "hidden"}> */}
                            <hr className="mb-3 text-slate-600 w-3/4 mx-auto"></hr>
                            {!isLoaded ? (
                                <div>Loading</div>
                            ) : (
                                <>
                                    <Map
                                        handlePoint={(a) => getSelectedPoint(a)}
                                    />
                                </>
                            )}
                        </div>

                        {/* {This is rob trying to create a box using JSX} */}
                        {/* {"dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15"} */}

                        <div className={view !== "upload" ? "hidden" : "dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15"}>
                            {/* <div class="dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15" id="dropbox"  className={toggleupload?  "hidden" : "dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15" } >   */}
                            {/* ( if{toggleupload ==  false})  {
                           <p>Hello</p> 
                          } */}
                            {/* <div class=""> */}
                            <p class="space-x-7">Drag and drop your files here</p>
                            <svg xmlns="http://www.w3.org/2000/svg" id="dropbox" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"  >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />

                            </svg>
                            {/* </div> */}
                            <p class="space-x-7 mt-6">OR </p>
                            {/* {:&nbsp;} */}
                            <br></br>
                            <label class="space-x-7 mt-6">Choose Your Files</label>
                            <svg onClick={() => handleAttachments2()} xmlns="http://www.w3.org/2000/svg" id="dropbox" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"  >
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                            </svg>
                        </div>
                        {/* </div> */}

                        {/* </div>  */}




                        {/* <!-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- --> */}



                        {/* {clicks.map((latLng, i) => (
                            <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
                        ))} */}

                        <p className={error === '' ? "hidden" : "text-center w-full text-red-500"}>{error}</p>

                        <div className="w-10/12 mx-auto flex flex-row-reverse items-center mt-5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                            </svg>

                            <label className={styles.switch}>
                                <input type="checkbox" onChange={() => toggleAnon()} />
                                <span className={[styles.slider, styles.round].join(' ')}></span>
                            </label>

                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="w-10/12 mx-auto flex flex-row-reverse items-center">
                            <small>{isAnon ? "Posting Anonymously" : "Posting Publicly"}</small>
                        </div>

                        <div className="w-10/12 mx-auto flex flex-row-reverse items-center mt-3 mb-10 text-slate-600">
                            <button type="submit" className="w-1/6 mt-3 px-1 py-2 bg-violet-500 mr-1 ml-3 text-white rounded">Create!</button>
                            <button type="button" className="w-1/6 mt-3 px-1 py-2 bg-slate-300 ml-1 rounded" onClick={() => Router.push("/web?page=bulletins")}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}

function Map({ handlePoint }) {
    const [center, setCenter] = useState({ lat: 33.021526, lng: -96.709848 })
    const [selected, setSelected] = useState(null)
    const [zoom, setZoom] = useState(12)

    useEffect(() => {
        handlePoint(selected)
    }, [selected])

    const onClickMap = (e) => {
        setSelected(e.latLng)
    }

    return (
        <>
            <p className="w-2/3 mx-auto">Click on the map to select a location or <button type="button" className="underline text-sky-500" onClick={() => setSelected(null)}>clear the map</button>:</p>
            <PlacesAutocomplete
                setSelected={setSelected}
                setZoom={setZoom}
                setCenter={setCenter}
            />
            <GoogleMap
                zoom={zoom}
                center={center}
                mapContainerClassName="map-container"
                onClick={onClickMap}
                clickableIcons={false}
            >
                {selected && <Marker position={selected} />}
            </GoogleMap>
        </>

    )
}

const PlacesAutocomplete = ({ setSelected, setZoom, setCenter }) => {
    const handleSelection = async (addr) => {
        const res = await getGeocode({ address: addr.description })
        const { lat, lng } = await getLatLng(res[0])
        setSelected({ lat, lng })
        setZoom(15)
        setCenter({ lat, lng })
    }

    return <AddrSearch
        handleSelection={(addr) => handleSelection(addr)}
    />
}


// This is where I would put the pop up toggle box 

const UploadDropZone = () => {
    console.log("GOT HERE")


}

function HideShowActions(toggleupload2, showDropZone, hideDropZone, toggleMap) {

    console.log("GOT HEREEEEEEEE")


    let toggleHandler = toggleupload2
    console.log("togleeeeeee", toggleHandler)
    //console.log(toggleHandler)

    if (toggleupload2 == false)
        return (
            <div className="dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15" >
                {/* <div class="dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15" id="dropbox"  className={toggleupload?  "hidden" : "dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15" } >   */}
                {/* ( if{toggleupload ==  false})  {
                           <p>Hello</p> 
                          } */}
                {/* <div class=""> */}
                <p class="space-x-7">Drag and drop your files here</p>
                <svg xmlns="http://www.w3.org/2000/svg" id="dropbox" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />

                </svg>
                {/* </div> */}
                <p class="space-x-7 mt-6">OR </p>
                {/* {:&nbsp;} */}
                <br></br>
                <label class="space-x-7 mt-6">Choose Your Files</label>
                <svg onClick={() => handleAttachments2()} xmlns="http://www.w3.org/2000/svg" id="dropbox" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
            </div>
        )
    else {
        if (toggleMap == true && toggleupload == true) {

            <div className="dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15" >
                {/* <div class="dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15" id="dropbox"  className={toggleupload?  "hidden" : "dropbox-class flex flex-col text-slate-600 mx-auto items-center p-8 border-dashed border-width: 10px border-4 border-indigo-500/100 h-50 w-15" } >   */}
                {/* ( if{toggleupload ==  false})  {
                           <p>Hello</p> 
                          } */}
                {/* <div class=""> */}
                <p class="space-x-7">Drag and drop your files here</p>
                <svg xmlns="http://www.w3.org/2000/svg" id="dropbox" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />

                </svg>
                {/* </div> */}
                <p class="space-x-7 mt-6">OR </p>
                {/* {:&nbsp;} */}
                <br></br>
                <label class="space-x-7 mt-6">Choose Your Files</label>
                <svg onClick={() => handleAttachments2()} xmlns="http://www.w3.org/2000/svg" id="dropbox" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                </svg>
            </div>

        }
    }

}


