// A row in the bulletin board
// Recieves props: up (upvote count) - int, down (downvote count) - int, statement - str, quotes - list of strings

import { useState, useEffect, useRef } from 'react'
import useUpdatesBulletin from '../lib/useUpdates'
import Swal from 'sweetalert2'


export default function BulletinRow(props){
    const targetBox = useRef()
    const [upVotes, setUpVotes] = useState(props.up)
    const [downVotes, setDownVotes] = useState(props.down)
    const [selected, setSelected] = useState(props.action)
    const [changed, setChanged] = useState(false)

    useEffect(() => {
        targetBox.current.addEventListener('toggle', (e) => {
            if(targetBox.current.open){
                //console.log('i am opened')
                props.handleOpen(props.postid,true)
            }else{
                //console.log('i am closed')
                props.handleOpen(props.postid,false)
            }
        })
    })

    const toggleMap = (e) => {
        let el = e.currentTarget  // map button
        let parent = el.parentElement.parentElement  // div element
        let map = parent.children.namedItem('map')  // iframe
        console.log(el,parent,map)
        let mapClassList = map.classList
        if(mapClassList.contains('hidden')){
            mapClassList.remove('hidden')
        }else{
            mapClassList.add('hidden')
        }
    }

    const handleUp = (e) => {
        e.preventDefault()
        if(selected[0]){  // undo the upvote
            setUpVotes(upVotes-1)
            setSelected([false, false])
        }else{  // do the upvote
            if(selected[1]){  // upvote from downvote
                setDownVotes(downVotes-1)
            }
            setUpVotes(upVotes+1)
            setSelected([true, false])
        }
        setChanged(true)
    }

    const handleDown = (e) => {
        e.preventDefault()
        if(selected[1]){  // undo the downvote
            setDownVotes(downVotes-1)
            setSelected([false, false])
        }else{  // do the downvote
            if(selected[0]){ // downvote from upvote
                setUpVotes(upVotes-1)
            }
            setDownVotes(downVotes+1)
            setSelected([false, true])
        }
        setChanged(true)
    }

    const handleDelete = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            backdrop: true,
            showConfirmButton: false,
            showDenyButton: true,
            showCancelButton: true,
            denyButtonText: 'Delete',
            preDeny: () => {
                //delete the post here and return status
                const body = {
                    postID: props.postid,
                }
                return fetch('/api/posts/deletepost', {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body),
                }).then((res) => {
                    console.log('response',res)
                    return res.json()
                }).catch((err) => {
                    console.log(err)
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            console.log('result2',result)
            if (result.isDenied && result.value.success === false) {
                Swal.fire('Oops!',`An error occurred: ${result.value.msg}`,'error')
            }else if(result.isDenied && result.value.success){
                Swal.fire('Success!','Your post was deleted','success')
            }
        })
    }

    const bulletinUpdates = useUpdatesBulletin(
                                    props.postid,props.uid,
                                    upVotes-props.up,
                                    downVotes-props.down,
                                    selected[0],
                                    selected[1],
                                    changed,
                                    2000)


    const mapStylesEnabled = "mt-2 rounded-lg shadow px-2 py-1 hover:bg-sky-100 mx-1"
    const mapStylesDisabled = "mt-2 rounded-lg px-2 py-1 bg-slate-200 mx-1 select-none pointer-events-none"
    const narrow = "shadow-sm mt-2 w-4/5 text-center bg-white hover:ring-2 hover:ring-violet-400 open:ring-1 open:ring-black/5 p-6 rounded-lg"
    const wide = "shadow border-2 border-violet-50 mt-2 w-11/12 text-center bg-white hover:ring-2 hover:ring-violet-400 open:ring-1 open:ring-black/5 p-6 rounded-lg"

    return (
        <>
            <details ref={targetBox} className={props.width==='wide' ? wide : narrow} open={props.open}>
                <summary name="summary" className="text-sm leading-6 text-slate-600 font-semibold select-none">
                    <span name="eventCount" className="font-bold text-emerald-500">{upVotes}</span> {props.statement}
                </summary>
                <div className="mt-3 flex flex-col items-center justify-center text-sm leading-6 text-slate-500 relative">
                    <p className="text-left mb-3 w-11/12">{props.body}</p>

                    <div name="bulletinText" className="mb-3 leading-loose w-11/12">
                        <p className="text-left text-black font-semibold">Comments:</p>
                        {props.quotes.map((quote, index) => (
                            <div key={index}>
                                <span>"{quote.comment}"</span>
                                <span className="text-xs"> -{quote.poster}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div name="bulletinButtons" className="flex items-baseline justify-center">
                        <button className={props.mapEnabled ? mapStylesEnabled : mapStylesDisabled} onClick={props.mapEnabled ? (e) => toggleMap(e) : null}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </button>
                        
                        <div name="upBtnDiv">
                            <button name="upBtn" className={selected[0] ? "mt-2 rounded-lg shadow px-2 py-1 bg-violet-500 text-white hover:bg-sky-100 mx-1" : "mt-2 rounded-lg shadow px-2 py-1 hover:bg-sky-100 mx-1"} onClick={(e) => handleUp(e)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                            </button>

                            <p className="text-emerald-500">{upVotes}</p>   
                        </div>
                        
                        <div name="downBtnDiv">
                            <button name="downBtn" className={selected[1] ? "mt-2 rounded-lg shadow px-2 py-1 bg-violet-500 text-white hover:bg-sky-100 mx-1" : "mt-2 rounded-lg shadow px-2 py-1 hover:bg-sky-100 mx-1"} onClick={(e) => handleDown(e)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                </svg>
                            </button>

                            <p className="text-red-500">{downVotes}</p>  
                        </div>
                        
                    </div>
                    
                    {props.children}

                    <div className={props.isAuthor? 'absolute bottom-0 left-0 flex' : 'hidden'}>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>    
                        </button>
                        
                        <button onClick={() => handleDelete()}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>     
                        </button>       
                    </div>

                    <p className="text-right w-full">{props.timestamp}</p>
                </div>
            </details>
        </>
    )
}