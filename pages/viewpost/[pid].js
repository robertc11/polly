import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState, useRef } from 'react'
import * as React from 'react'
import Router from 'next/router'
import { getCurrentUnix, timeAgo, unixToReg } from '../../lib/timestamp'
import Logo from "../../components/logo"
import useUpdatesBulletin from "../../lib/useUpdates"
import useOnScreen from "../../lib/useOnScreen"
import { getSessionSsr } from "../../lib/redis-auth/wrappers"
import useUser from "../../lib/useUser"
import Webnav from "../../components/webnav"
import { fullToAbbr } from "../../lib/extensions"

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

export default function ViewPostPage({ user }){
    const verify_session = useUser({ redirectTo: '/login' })

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
    const [files, setFiles] = useState(null)
    const [totalContent, setTotalContent] = useState(0)
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
                    setFiles(data.data[0]?.attachments)
                    setCommentsCount(data.data[0]?.comments[0]?.numComments || 0)
                    setTotalContent(data.data[0]?.map+data.data[0]?.attachments.length)
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

    const {last_up, last_down} = useUpdatesBulletin(
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

    // // handles grabbing the comments when you scroll

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

    const [selectedContent, setSelectedContent] = useState(0)

    return (
        <>
            { notFound ? (
                <div className="h-screen w-full flex items-center justify-center flex-col">
                    <p className="text-xl font-dongji"><span className="text-3xl">404</span> - Page Not Found</p>
                    <Link href="/web"><a className="mt-1 text-blue-500 underline">Take me back!</a></Link>
                </div>
            ) : (
                <>
                    <Webnav user={user} redirect={'/web'}></Webnav>

                    <div className="bg-[#f5f5f5] min-h-screen w-screen relative">
                        <button onClick={() => handleBack()} className="bg-[#f5f5f5] w-[24%] h-full absolute left-0 top-0">
                            <p className="invisible">filler text</p>
                        </button>

                        <div id="textWrapper" className="w-1/2 min-h-screen bg-white mx-auto shadow-lg py-8 px-16 z-50">
                            <div className="relative">
                                <div className="w-full font-dongji font-semibold">
                                    <h1 className="text-2xl">{statement}</h1>
                                    <p className="mt-3 text-slate-600 text-md">{body}</p>
                                </div>
                                
                                <div id="contentWrapper" className={totalContent === 0 ? "hidden" : "mt-3 flex justify-center items-center w-4/5 mx-auto relative"}>
                                    <button 
                                        onClick={() => {
                                            if(selectedContent === 0){
                                                setSelectedContent(totalContent-1)
                                            }else{
                                                setSelectedContent(selectedContent-1)
                                            }
                                        }} 
                                        className="bg-violet-300 py-5 px-1 rounded-l-md"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div id="mediawrapper" className="bg-black/70 w-11/12 flex flex-col items-center py-3 border-4 border-violet-300 mt-2 rounded relative">
                                        { (mapEnabled && selectedContent === 0) ? (
                                            <iframe name="map" width="99%" height={375} loading="lazy" allowFullScreen src={mapLink}></iframe>
                                        ) : ""}

                                        {files?.map((file,index) => {
                                            if(file.file_type === 'image/jpeg' || file.file_type === 'image/png'){
                                                return (
                                                    <div className={(selectedContent === index+mapEnabled) ? null : "hidden"} key={file.file_name}>
                                                        <Image width={600} height={375} objectFit="contain" src={`http://localhost:3000/api/web/content/${file.file_name}${fullToAbbr(file.file_type)}`} />
                                                        <div className="absolute top-1 right-1 flex gap-1">
                                                            <button onClick={() => window.open(`http://localhost:3000/api/web/content/${file.file_name}${fullToAbbr(file.file_type)}`,'_blank')} className="bg-violet-500 rounded px-3 text-white py-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            }else if(file.file_type === 'video/quicktime' || file.file_type === 'video/mp4'){
                                                return (
                                                    <video className={(selectedContent === index+mapEnabled) ? null : "hidden"} key={file.file_name} controls width={600} height={375}>
                                                        <source src={`http://localhost:3000/api/web/content/${file.file_name}${fullToAbbr(file.file_type)}`} type={file.file_type}></source>
                                                    </video>
                                                )
                                            }else{
                                                return (
                                                    <div className={(selectedContent === index+mapEnabled) ? null : "hidden"} key={file.file_name}>
                                                        <Image src={'/file-earmark-pdf-white.svg'} objectFit="contain" width={600} height={375} alt="File Thumbnail"></Image>
                                                        <div className="absolute top-1 right-1 flex gap-1">
                                                            <a href={`http://localhost:3000/api/web/content/${file.file_name}${fullToAbbr(file.file_type)}`} download={file.file_name} className="bg-violet-500 rounded px-3 text-white py-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                    <button onClick={() => setSelectedContent((selectedContent+1)%totalContent)} className="bg-violet-300 py-5 px-1 rounded-r-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                <div id="voteWrapper" className="mt-5 flex items-center">
                                    <div name="upBtnDiv" className="flex flex-col items-center justify-center">
                                        <button name="upBtn" 
                                            className={
                                                last_up === null ? "mt-2 rounded-lg border-2 border-gray-300 bg-gray-300 px-2 py-1 mx-1 animate-pulse" 
                                                : selected?.[0] ? "mt-2 rounded-lg border-2 border-gray-300 px-2 py-1 bg-violet-500 text-white hover:bg-sky-100 mx-1" 
                                                : "mt-2 rounded-lg border-2 border-gray-300 px-2 py-1 hover:bg-sky-100 mx-1"
                                            } 
                                            onClick={ last_up !== null ? (e) => handleUp(e) : null }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                        </button>

                                        <p className="text-emerald-500 text-sm">{up}</p>   
                                    </div>
                                    
                                    <div name="downBtnDiv" className="flex flex-col items-center justify-center">
                                        <button name="downBtn" 
                                            className={ 
                                                last_down === null ? "mt-2 rounded-lg border-2 border-gray-300 bg-gray-300 px-2 py-1 mx-1 animate-pulse" 
                                                : selected?.[1] ? "mt-2 rounded-lg border-2 border-gray-300 px-2 py-1 bg-violet-500 text-white hover:bg-sky-100 mx-1" 
                                                : "mt-2 rounded-lg border-2 border-gray-300 px-2 py-1 hover:bg-sky-100 mx-1" 
                                            }
                                            onClick={ last_down !== null ? (e) => handleDown(e) : null }
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                            </svg>
                                        </button>

                                        <p className="text-red-500 text-sm">{down}</p>  
                                    </div>
                                </div>

                                <div className="absolute bottom-2 right-5 font-dongji">
                                    <p className="text-right text-xs">Posted by <span className="text-violet-400">{authorName}</span> on</p>
                                    <p className="text-right text-xs">{unixToReg(timestamp)}</p>
                                </div>    
                            </div>
                            

                            <hr className="mt-3"></hr>

                            <div id="commentsWrapper" className="mt-2 font-dongji">
                                <h2 className="">Comments:</h2>
                                
                                <form onSubmit={handleComment} className="w-11/12 mx-auto mt-3 relative text-gray-400 focus-within:text-violet-400">
                                    <textarea type="text" name="commentBody" id="leadingIcon" placeholder="Add a comment..." className="w-full pl-4 pr-4 py-1.5 rounded-md text-sm text-gray-600 outline-none border-2 border-gray-300 focus:border-violet-500 peer transition" />
                                    <div className="w-full flex flex-row-reverse">
                                        <button type="submit" className="text-sm text-white bg-violet-500 py-1 px-1.5 rounded">Comment</button>
                                    </div>  
                                </form>

                                <div id="commentList" >
                                    {comments?.map((oneComment,index) => (
                                        <div key={oneComment?._id} className="w-11/12 mt-3 p-6 mx-auto shadow-md border-2 border-gray-100 relative">
                                            <p className="text-sm">{oneComment?.comment}</p>
                                            <p className="absolute right-1 bottom-1 text-xs">{oneComment?.author?.authorName}<span className="ml-2 text-slate-400">{timeAgo(oneComment?.timestamp)} ago</span></p> 
                                        </div>
                                    ))}
                                </div>

                                <div className="w-full text-bold text-center invisible" ref={ref}>
                                    fucker
                                </div>
                            </div>
                        </div>

                        <button onClick={() => handleBack()} className="bg-[#f5f5f5] w-[24%] h-full absolute right-0 top-0">
                            <p className="invisible">filler text</p>
                        </button>
                    </div>
                </>
            )}
        </>
    )

}