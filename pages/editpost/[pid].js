import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState, useRef } from 'react'
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api"
import * as React from 'react'
import Router from 'next/router'
import fetchJson from '../../lib/fetchJson'
import Script from 'next/script'
import Head from 'next/head'
import styles from '../../styles/CreatePostPage.module.css'
import { getGeocode, getLatLng } from "use-places-autocomplete"
import AddrSearch from '../../components/addrsearch'
import { getSessionSsr } from "../../lib/redis-auth/wrappers"
import useUser from "../../lib/useUser"
import { fullToAbbr } from "../../lib/extensions"


const LIBS = ["places"]

export async function getServerSideProps({ req }){
    const user = await getSessionSsr(req)

    if(!user){
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            }
        }
    }

    return {
        props: { user }
    }
}

export default function EditPostPage({ user }){
    const verify_session = useUser({ redirectTo: '/login' })

    // preloaded form data
    const [ notFound, setNotFound ] = useState(false)
    const [ title, setTitle ] = useState('')
    const [ body, setBody ] = useState('')
    const [ author, setAuthor ] = useState('')
    const [stagedFiles, setStagedFiles] = useState([])
    const [totalSize, setTotalSize] = useState(0)
    const [oldFiles, setOldFiles] = useState([])

    // grab the post id from url
    const router = useRouter()
    const { pid } = router.query

    // load initial data
    useEffect(async () => {
        if(pid === undefined) return

        console.log(pid)
        const post = await fetch(`/api/posts/getonepost?obj_id=${pid}`).then(res => res.json()).catch((err) => console.log(err))
        if(post===undefined || !post.success){
            setNotFound(true)
            return
        }else{
            setAuthor(post.data[0]?.author.authorID)
            setTitle(post.data[0]?.statement)
            setBody(post.data[0]?.body)
            let init_staged = []
            for(let i=0; i<post.data[0].attachments.length; i++){
                const this_file = {
                    file_data: {
                        name: post.data[0].attachments[i].file_name,
                        type: post.data[0].attachments[i].file_type,
                    },
                    file_url: `http://localhost:3000/api/web/content/${post.data[0].attachments[i].file_name}${fullToAbbr(post.data[0].attachments[i].file_type)}`,
                }
                init_staged.push(this_file)
            }
            setStagedFiles(stagedFiles.concat(init_staged))
            setOldFiles(oldFiles.concat(init_staged))
        }
    }, [pid])

    // -----------------------------------------

    const [error, setError] = useState('')
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY,
        libraries: LIBS,
    })
    const [point, setPoint] = useState(null)
    const getSelectedPoint = (value) => {
        setPoint(value)
    }

    const [view, setView] =useState(null)
 
    const handleMapToggle = (e) => {
        if(view === "map") {
            setView(null) 
        } else {
            setView("map")
        }
    }

    const [toggleupload, setToggleUpload] = useState(false);

    const handleuploadtoggle = (e) => {
        setToggleUpload(!toggleupload)
        if(view === "upload") {
            setView(null) 
        } else {
            setView("upload")
        }
    }

    const [activeElement, setActiveElement] = useState(null)
    const [toggleEmojis, setToggleEmojis] = useState(false)
    const handleEmoji = () => {
        const emojis = document.getElementById("emoticons")
        if(toggleEmojis){
            emojis.className = styles.exit
        }else{
            emojis.className = "fixed z-50 flex justify-center items-center text-4xl rounded-r border border-gray-300 shadow-lg animate-slideIn"
        }
        setToggleEmojis(!toggleEmojis)
    }
    const addEmoji = (e) => {
        e.preventDefault()
        const emojiToAdd = e.currentTarget.innerText
        if(activeElement === "input"){
            document.getElementById("title").value = document.getElementById("title").value + " " + emojiToAdd
        }else if(activeElement == "textarea"){
            document.getElementById("body").value = document.getElementById("body").value + " " + emojiToAdd
        }else{
            return
        }
    }

    const handleChange = (e) => {
        if(e.currentTarget.name === 'title'){
            setTitle(e.currentTarget.value)
        }else if(e.currentTarget.name === 'textContent'){
            setBody(e.currentTarget.value)
        }else{
            return
        }
    }

    const [newFiles, setNewFiles] = useState([])
    const handleUploadFiles = (uploaded_files) => {
        const temp_staged_files = []
        var unsupported = ""
        var temp_total_size = 0
        for(let i=0; i < uploaded_files.length; i++){
            const file = uploaded_files.item(i)                  
            if((file.type !== "application/pdf") && (file.type !==  "image/png") && (file.type !==  "image/jpeg") && (file.type !==  "video/quicktime") && (file.type !==  "video/mp4")) {              
                unsupported += `${file.name}, `
                continue
            }
            temp_total_size += file.size
            let image_thumbnail
            if(file.type === "image/png" || file.type === "image/jpeg"){
                image_thumbnail = window.URL.createObjectURL(file)
            }else if(file.type === "application/pdf"){
                image_thumbnail = '/file-earmark-pdf.svg'
            }else if(file.type === "video/quicktime" || file.type === "video/mp4"){
                image_thumbnail = '/file-earmark-play.svg'
            }else{
                image_thumbnail = '/file-earmark.svg'
            }
            temp_staged_files.push({file_data: file, file_url: image_thumbnail})
        }
        if(totalSize+temp_total_size > 4000000) {
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: "Your files are too large. Max upload size is 4mb."
            })
            return
        }
        if(unsupported !== "") {            
            Swal.fire({
                icon: 'error',
                title: 'Unknown Files',
                text: unsupported+' are not of a supported file type.'
            })
        }
        setStagedFiles(stagedFiles.concat(temp_staged_files))
        setNewFiles(newFiles.concat(temp_staged_files))
        setTotalSize(totalSize+temp_total_size)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        handleUploadFiles(e.dataTransfer.files)
    }

    const handleDragOver = (e) => {
        e.stopPropagation()
        e.preventDefault()
    }
    
    const [trigger, setTrigger] = useState(false)
    const handleDeleteFile = (index) => {
        let temp_staged_files = stagedFiles
        let temp_new_files = newFiles
        let temp_old_files = oldFiles
        setTotalSize(totalSize-temp_staged_files[index].file_data.size)     
        URL.revokeObjectURL(temp_staged_files[index].file_url)
        if(index <= (oldFiles.length-1)){ // deleting an existing file, no change to newfiles array but need to change stagedfiles and oldfiles
            temp_staged_files.splice(index, 1)
            temp_old_files.splice(index,1)
            setOldFiles(temp_old_files)
        }else{  // deleting a new file, need to remove from stagedfiles and newfiles but not oldfiles
            let offset = stagedFiles.length - newFiles.length
            temp_staged_files.splice(index, 1)
            temp_new_files.splice(index-offset,1)
        }
        setTrigger(!trigger)
        setStagedFiles(temp_staged_files)
        setNewFiles(temp_new_files)
    }

    const [isAnon, setIsAnon] = useState(false)
    const toggleAnon = () => {
        setIsAnon(!isAnon)
    }

    const handleSubmit = async (e) => {
        const disabledClasses = ['cursor-not-allowed', 'animate-pulse', 'pointer-events-none']
        disabledClasses.map(item => document.getElementById("submiteditpost").classList.toggle(item))
        e.preventDefault()
        var body = new FormData()
        body.append('authID',author)
        body.append('postID',pid)
        body.append('statement',e.currentTarget.title.value)
        body.append('map',(point !== null)?true:false)
        body.append('mapLink',(point !== null)?generateLink(point):'')
        body.append('body',e.currentTarget.textContent.value)
        body.append('anonymous',isAnon)
        body.append('oldFiles',JSON.stringify(oldFiles))
        for(let i=0; i<newFiles.length; i++){
            body.append(`file_${i}`, newFiles[i].file_data)
        }

        try {
            const res = await fetchJson('/api/posts/editpost', {
                method: 'POST',
                body: body,
            })

            if (res.success) {
                Router.push('/web?page=bulletins')
                return
            }
            else {
                setError(res.msg)
            }
        } catch (err) {
            setError(err.data.msg)
        }finally{
            disabledClasses.map(item => document.getElementById("submiteditpost").classList.toggle(item))
        }
    }

    const generateLink = (point) => {
        var plusCode = null
        if(typeof(point.lat) === 'number'){
            plusCode = OpenLocationCode.encode(point.lat, point.lng)
        }else if(typeof(point.lat) === 'function'){
            plusCode = OpenLocationCode.encode(point.lat(), point.lng())
        }else{
            return ''
        }
        // const plusCode = OpenLocationCode.encode(lat, lng)
        plusCode = plusCode.replace('+','%2B')
        const link = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo&q=${plusCode}`
        return link
    }

    return (
        <>
            { notFound ? (
                <div className="h-screen w-full flex items-center justify-center flex-col">
                    <p className="text-xl font-dongji"><span className="text-3xl">404</span> - Page Not Found</p>
                    <Link href="/web"><a className="mt-1 text-blue-500 underline">Take me back!</a></Link>
                </div>
            ) : (
                <>
                    <Script
                        src={"https://cdn.jsdelivr.net/openlocationcode/latest/openlocationcode.min.js"}
                    >    
                    </Script>

                    <Head>
                        <title>Edit Post</title>
                    </Head>

                    <div className="relative pb-10 pt-10 min-h-screen min-w-screen bg-[#f5f5f5]">
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

                        <h1 className="text-center font-dongji text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 mb-10">Your Shiny Edited Post</h1>
                        <div className="border border-gray-300 w-7/12 mx-auto py-10 shadow-lg rounded-lg bg-white">
                            <form onSubmit={handleSubmit} className="flex flex-col">
                                <label className="w-10/12 mx-auto mt-3">Your Title:</label>
                                <input id="title" className="w-10/12 mx-auto border border-gray-300 rounded-sm p-1 bg-gray-100 outline-none focus:border-violet-400" 
                                    type="text"
                                    name="title"
                                    placeholder=" I love kitties!"
                                    maxLength="60"
                                    onFocus={() => setActiveElement("input")}
                                    value={title}
                                    onChange={handleChange}
                                />

                                <label className="w-10/12 mx-auto mt-3">Tell Us More:</label>
                                <textarea id="body" className="w-10/12 h-28 mx-auto border border-gray-300 rounded-sm p-1 bg-gray-100 outline-none focus:border-violet-400" 
                                    type="text" 
                                    name="textContent"
                                    placeholder=" My cats love..."
                                    maxLength="1500"
                                    onFocus={() => setActiveElement("textarea")}
                                    value={body}
                                    onChange={handleChange}
                                />
                                
                                <div className="w-10/12 mx-auto flex text-gray-500 m-2">
                                    <svg onClick={() => handleMapToggle()} className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <svg onClick={() => handleEmoji()} className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <svg onClick={() => handleuploadtoggle()} id='fileSelect2' className="mr-2 cursor-pointer hover:text-gray-700 border rounded-full p-1 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                </div>


                                <div className={view === "map" ? null : "hidden"}>
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


                                <div className={view === "upload" ? null : "hidden"}>
                                    <div className="w-10/12 my-3 mx-auto flex flex-wrap items-center gap-1">
                                        {stagedFiles.map((file,index) => (
                                            <div key={index} className="relative">
                                                <button
                                                    type="button" 
                                                    onClick={() => handleDeleteFile(index)}
                                                    className="absolute top-0 right-0 z-20 bg-rose-500 text-white rounded-full"
                                                >
                                                    <p className="w-4 h-4"></p>
                                                </button>
                                                
                                                <div className="m-1 flex flex-col h-36 w-36 rounded shadow-md border-[1px] border-slate-200 overflow-x-hidden relative group bg-white">
                                                    <div className="group-hover:absolute group-hover:block hidden min-w-full min-h-full bg-black/60 z-10" />
                                                    <Image src={file.file_url} width={300} height={300} alt="File Thumbnail"></Image>
                                                    <small className="text-xs">
                                                        {file.file_data.name}
                                                    </small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div 
                                        id="dropbox" 
                                        className="text-center flex flex-col text-slate-600 items-center p-8 border-dashed border-4 border-indigo-500 w-2/4 mx-auto"
                                        onDrop={(e) => handleDrop(e)}
                                        onDragOver={(e) => handleDragOver(e)}
                                    >
                                        <p className="space-x-7">Drag and drop your files here</p>
                                        <svg xmlns="http://www.w3.org/2000/svg"  className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"  >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                    
                                        <p className="space-x-7 mt-6">OR </p>
                                    
                                        <br></br>
                                        <label className="space-x-7 mt-6">Choose Your Files</label>
                                        <svg 
                                            onClick={() => {
                                                let elem = document.getElementById('fileClick')
                                                elem.click()
                                            }} 
                                            id='fileSelect' 
                                            xmlns="http://www.w3.org/2000/svg"  
                                            className="h-9 w-9" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor" 
                                            strokeWidth="2"  
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                                        </svg>
                                        <input 
                                            onChange={(e) => {
                                                e.stopPropagation()
                                                handleUploadFiles(e.target.files)
                                            }} 
                                            type="file" 
                                            id="fileClick" 
                                            style={{ display: 'none' }} 
                                            accept=".png,.jpg,.pdf,.mov,.mp4" 
                                            multiple 
                                        />
                                    </div>
                                </div>
                                
                                <p className={error===''?"hidden":"text-center w-full text-red-500"}>{error}</p>

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
                                    <button id="submiteditpost" type="submit" className="w-1/6 mt-3 px-1 py-2 bg-violet-500 mr-1 ml-3 text-white rounded">Save!</button>
                                    <button type="button" className="w-1/6 mt-3 px-1 py-2 bg-slate-300 ml-1 rounded" onClick={() => Router.push("/web?page=bulletins")}>Cancel</button>                           
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
            
        </>
    )
}


function Map({handlePoint}) {
    const [center, setCenter] = useState({lat: 33.021526, lng: -96.709848})
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
                {selected && <Marker position={selected}/>}
            </GoogleMap>
        </>
        
    )
}

const PlacesAutocomplete = ({setSelected, setZoom, setCenter}) => {
    const handleSelection = async (addr) => {
        const res = await getGeocode({address: addr.description})
        const {lat, lng} = await getLatLng(res[0])
        setSelected({lat, lng})
        setZoom(15)
        setCenter({lat, lng})
    }

    return <AddrSearch 
        handleSelection={(addr) => handleSelection(addr)}
    />
}