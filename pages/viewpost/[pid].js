import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState, useRef } from 'react'
import { Wrapper } from "@googlemaps/react-wrapper"
import * as React from 'react'
import Marker from "../../components/marker"
import Map from '../../components/map'
import useUser from '../../lib/useUser'
import Router from 'next/router'
import { getCurrentUnix, timeAgo, unixToReg } from '../../lib/timestamp'
import fetchJson from '../../lib/fetchJson'
import Script from 'next/script'
import Head from 'next/head'
import styles from '../../styles/CreatePostPage.module.css'
import Logo from "../../components/logo"
import useUpdatesBulletin from "../../lib/useUpdates"
import useOnScreen from "../../lib/useOnScreen"

export default function ViewPostPage(){
    const { user, mutateUser } = useUser({
        redirectTo: "/login",
    })

    // grab the post id from url
    const router = useRouter()
    const { pid } = router.query

    // state to store data being pulled
    const [notFound, setNotFound] = useState(false)
    const [up, setUp] = useState(null)
    const [down, setDown] = useState(null)
    const [statement, setStatement] = useState(null)
    const [body, setBody] = useState(null)
    const [mapEnabled, setMapEnabled] = useState(null)
    const [mapLink, setMapLink] = useState(null)
    const [postid, setpostid] = useState(null)
    const [timestamp, setTimestamp] = useState(null)
    const [authorName, setAuthorName] = useState(null)
    const [selected, setSelected] = useState(null)
    const [changed, setChanged] = useState(false)
    const [comments, setComments] = useState([])
    const [commentsCount, setCommentsCount] = useState(null)
    const [commentsLoaded, setCommentsLoaded] = useState(false)

    useEffect(async () => {
        if(pid === undefined) return

        console.log(pid)
        fetch(`/api/posts/getonepost?obj_id=${pid}`)
            .then(res => res.json())
            .then(data => {
                console.log(data.data, data.success)
                if(!data.success){
                    setNotFound(true)
                    return
                }else{
                    setUp(data.data[0]?.upvotes)
                    setDown(data.data[0]?.downvotes)
                    setStatement(data.data[0]?.statement)
                    setBody(data.data[0]?.body)
                    setMapEnabled(data.data[0]?.map)
                    setMapLink(data.data[0]?.mapLink)
                    setpostid(data.data[0]?._id)
                    setTimestamp(data.data[0]?.timestamp)
                    setSelected([data.data[0]?.useractions[0]?.action?.upvote||false, data.data[0]?.useractions[0]?.action?.downvote||false])
                    setAuthorName(data.data[0]?.author.authorName)
                    setCommentsCount(data.data[0]?.comments[0]?.numComments)
                    document.title = data.data[0]?.statement
                }

                //console.log('this is our postid', data.data[0]?._id)
                return fetch(`/api/posts/getcomment?post=${data.data[0]?._id}&per_page=${15}&obj_id=${0}`)
            })
            .then(res => res.json())
            .then(data => {
                console.log('comments',data)
                setComments(comments.concat(data))
                setCommentsLoaded(true)
            }).catch((err) => console.log(err))
    }, [pid])

    const searchForBulletin = (targetID, bulletinArr) => {
        //binary search through comments array
        //console.log(targetID, bulletinArr)
        var lp = 0
        var rp = bulletinArr.length-1
        while(lp <= rp){
            var mid = Math.floor((lp+rp)/2)
            if(parseInt(bulletinArr[mid]._id,16)/10000000000 == targetID){
                return mid
            }else if(targetID < parseInt(bulletinArr[mid]._id,16)/10000000000){
                lp = mid+1
            }else{
                rp = mid-1
            }
        }
        return -1
    }

    const handleBack = () => {
        // update the sessionStorage to reflect the new upvote count, downvote count, useraction, and commentCount for this post
        if(!sessionStorage.getItem('bulletins')) return
        var sessBulletins = sessionStorage.getItem('bulletins')
        sessionStorage.removeItem('bulletins')

        sessBulletins = JSON.parse(sessBulletins)
        var index = searchForBulletin(parseInt(postid,16)/10000000000, sessBulletins)
        //console.log(index)
        sessBulletins[index]?.upvotes = up
        sessBulletins[index]?.downvotes = down
        if(sessBulletins[index]?.useractions.length == 0){
            sessBulletins[index]?.useractions = [{
                action: {
                    upvote: selected[0],
                    downvote: selected[1],
                }
            }]
        }else{
            sessBulletins[index]?.useractions[0]?.action?.upvote = selected[0]
            sessBulletins[index]?.useractions[0]?.action?.downvote = selected[1]    
        }
        
        console.log('this is the length of comments!',comments.length)
        if(sessBulletins[index]?.comments.length == 0){
            sessBulletins[index]?.comments = [{numComments: commentsCount}]
        }else{
            sessBulletins[index]?.comments[0]?.numComments = commentsCount   
        }
        
        //console.log(sessBulletins)

        if(sessionStorage.getItem('bulletins')) return
        sessionStorage.setItem('bulletins', JSON.stringify(sessBulletins))
        router.push("/web?page=bulletins")
    }

    const handleUp = (e) => {
        e.preventDefault()
        if(selected[0]){  // undo the upvote
            setUp(up-1)
            setSelected([false, false])
        }else{  // do the upvote
            if(selected[1]){  // upvote from downvote
                setDown(down-1)
            }// vanilla upvote
            setUp(up+1)
            setSelected([true, false])
        }
        setChanged(true)
    }

    const handleDown = (e) => {
        e.preventDefault()
        if(selected[1]){  // undo the downvote
            setDown(down-1)
            setSelected([false, false])
        }else{  // do the downvote
            if(selected[0]){ // downvote from upvote
                setUp(up-1)
            }
            setDown(down+1)
            setSelected([false, true])
        }
        setChanged(true)
    }

    const bulletinUpdates = useUpdatesBulletin(
        postid,
        user?.uid,
        up,
        down,
        selected,
        changed,
        2000
    )

    // // setting up the infinite scroll element
    const ref = useRef()
    const isVisible = useOnScreen(ref)

    // // handles grabbing the bulletin posts when you scroll and when you first load the bulletin page

    useEffect(() => {
        const fetchData = async () => {
            let key = 0
            if(comments.length > 0){
                key = comments?.[comments.length-1]?._id
            }
            //console.log('key!',key,postid)
            const res = await fetch(`/api/posts/getcomment?post=${postid}&per_page=${15}&obj_id=${key}`).then(res => res.json()).catch(err => console.log('error fetching comments!',err))
            console.log('comments',res)
            setComments(comments.concat(res))
        }

        if(isVisible && commentsLoaded){
            fetchData()
        }
    }, [isVisible])


    const handleComment = async (e) => {
        e.preventDefault()
        //props.handleComment(props.postid, e.currentTarget.commentBody.value)
        var body ={
            bulletinpostID: postid,
            comment: e.currentTarget.commentBody.value,
            author: {
                authorID: user?.uid,
                authorName: user?.username,
            },
            timestamp: getCurrentUnix(),
        }
        console.log(body)
        
        if(body.comment.trim() === '') return

        fetch('/api/posts/addcomment', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        }).then(res => res.json()).then(data => {
            console.log('comment res',data)
            if(data.success){
                body._id = data.commentID
                setComments([body].concat(comments))
            }
            setCommentsCount(commentsCount+1)
        }).catch(err => console.log('posting comment failed!', err))

        e.currentTarget.commentBody.value = ''
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
                    <div id="webnav" className="w-full flex justify-between p-3 bg-gradient-to-r from-violet-500 to-indigo-500">
                        <div className="flex items-center">
                            <h1 className="text-xl text-white font-bold ml-5">Hello, {user?.first} {user?.last}</h1>
                        </div>

                        <div className="flex items-center">
                            <Link href="/"><a><Logo theme={"light"} /></a></Link>
                            <h1 className="text-2xl text-white">｜</h1>
                            <Link href="/login">
                                <a className="font-bold text-white mr-5 text-lg"
                                    onClick={async (e) => {
                                        e.preventDefault()
                                        mutateUser(
                                            await fetchJson("/api/logout", { method: "POST" }),
                                            false,
                                        );
                                    }}
                                >
                                    Logout
                                </a>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-gray-100 min-h-screen w-screen relative">
                        <button onClick={() => handleBack()} className="bg-gray-100 w-[24%] h-full absolute left-0 top-0">
                            <p className="invisible">filler text</p>
                        </button>

                        <div id="textWrapper" className="w-1/2 min-h-screen bg-white mx-auto shadow-lg py-8 px-16 z-50">
                            <div className="relative">
                                <div className="w-full font-dongji font-semibold">
                                    <h1 className="text-2xl">{statement}</h1>
                                    <p className="mt-5 leading-8 tracking-wide text-slate-600 text-xl">{body}</p>
                                </div>
                                
                                <div id="contentWrapper" className="mt-3 flex justify-center items-center">
                                    { mapEnabled ? (
                                        <iframe name="map" width="600" height="375" className="mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src={mapLink}></iframe>
                                    ) : ""}
                                </div>

                                <div id="voteWrapper" className="mt-5 flex items-center">
                                    <div name="upBtnDiv" className="flex flex-col items-center justify-center">
                                        <button name="upBtn" className={selected?.[0] ? "mt-2 rounded-lg border-2 border-gray-300 px-2 py-1 bg-violet-500 text-white hover:bg-sky-100 mx-1" : "mt-2 rounded-lg border-2 border-gray-300 px-2 py-1 hover:bg-sky-100 mx-1"} onClick={(e) => handleUp(e)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                        </button>

                                        <p className="text-emerald-500 text-sm">{up}</p>   
                                    </div>
                                    
                                    <div name="downBtnDiv" className="flex flex-col items-center justify-center">
                                        <button name="downBtn" className={selected?.[1] ? "mt-2 rounded-lg border-2 border-gray-300 px-2 py-1 bg-violet-500 text-white hover:bg-sky-100 mx-1" : "mt-2 rounded-lg border-2 border-gray-300 px-2 py-1 hover:bg-sky-100 mx-1"} onClick={(e) => handleDown(e)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                            </svg>
                                        </button>

                                        <p className="text-red-500 text-sm">{down}</p>  
                                    </div>
                                </div>

                                <div className="absolute bottom-2 right-5">
                                    <p className="text-right text-xs">Posted by <span className="text-violet-400">{authorName}</span> on</p>
                                    <p className="text-right text-xs">{unixToReg(timestamp)}</p>
                                </div>    
                            </div>
                            

                            <hr className="mt-3"></hr>

                            <div id="commentsWrapper" className="mt-2">
                                <h2 className="">Comments:</h2>
                                
                                <form onSubmit={handleComment} className="w-11/12 mx-auto mt-3 relative flex items-center text-gray-400 focus-within:text-violet-400">
                                    <input type="text" name="commentBody" id="leadingIcon" placeholder="Add a comment" className="w-full pl-4 pr-4 py-1.5 rounded-xl text-sm text-gray-600 outline-none border-2 border-gray-300 focus:border-violet-400 peer transition" />
                                    <span className="absolute right-4 h-6 pl-4 flex items-center border-l-2 border-gray-300 bg-white peer-focus:border-violet-400">
                                        <button type="submit">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                            </svg>    
                                        </button>
                                    </span>
                                </form>

                                <div id="commentList" >
                                    {comments?.map((oneComment,index) => (
                                        <div key={oneComment._id} className="w-11/12 mt-3 p-6 mx-auto shadow-md border-2 border-gray-100 relative">
                                            <p className="text-sm">{oneComment.comment}</p>
                                            <p className="absolute right-1 bottom-1 text-xs">{oneComment.author.authorName}<span className="ml-2 text-slate-400">{timeAgo(oneComment.timestamp)} ago</span></p> 
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full text-bold text-center invisible" ref={ref}>
                                    fucker
                                </div>
                            </div>
                        </div>

                        <button onClick={() => handleBack()} className="bg-gray-100 w-[24%] h-full absolute right-0 top-0">
                            <p className="invisible">filler text</p>
                        </button>
                    </div>
                </>
            )}
        </>
    )

}