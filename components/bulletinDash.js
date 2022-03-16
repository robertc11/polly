import BulletinRow from '../components/bulletinRow'
import { getCurrentUnix, unixToReg } from '../lib/timestamp'
import Swal from 'sweetalert2'
import React, { useState } from 'react'



export default function BulletinDash(props){
    const user = {
        uid: props.uid,
        username: props.username,
        cityID: props.cityid,
        isLoggedIn: props.login,
    }

    const [opened,setOpened] = useState(new Map())

    const handleOpen = (postid,value) => {
        setOpened(opened.set(postid,value))
        console.log('opened is changed!',opened)
    }

    const create = (e) => {
        e.preventDefault()
        const fetchstatus = null
        Swal.fire({
            title: "Create a Post!",
            html: '<input id="postTitle" placeholder="Your shiny new title" class="w-full rounded border-2 border-violet-500 mb-5 p-1 focus:ring focus:outline-none">'+
                '<textarea id="postContent" placeholder="Give us the deets 👀" class="w-full rounded border-2 border-violet-500 p-1 focus:ring focus:outline-none">',
            focusConfirm: false,
            showDenyButton: true,
            denyButtonColor: "#A78BFA",
            showCloseButton: true,
            showConfirmButton: true,
            confirmButtonText: "Post!",
            confirmButtonColor: "#6EE7B7",
            denyButtonText: "Cancel",
            preConfirm: async () => {
                const title = document.getElementById('postTitle').value
                const body = document.getElementById('postContent').value
                if(title.trim()==='' || body.trim()==='') return
                const newPost = {
                    upvotes: 1,
                    downvotes: 0,
                    statement: title,
                    map: false,
                    mapLink: "",
                    city: user.cityID[3],
                    timestamp: getCurrentUnix(),
                    body: body,
                    user: user,
                }
                const result = await fetch("/api/createpost", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newPost)
                })
                console.log('this is the result of trying to create the post!', result)
                fetchstatus = result.status
            }
        }).then((result) => {
            console.log('this is the result of the swal!', result, fetchstatus)
            if(result.isConfirmed && fetchstatus===200){
                Swal.fire(
                    'Success!',
                    'Your post has been added.',
                    'success',
                )
            }
        })
    }

    // const { bulletins } = useBulletin(user)
    const { bulletins } = props.bulletins

    return (
        <>
            {bulletins !== undefined && (
                <>
                    <div className="flex items-center relative w-full">
                        <h1 className="text-slate-700 text-center w-full text-4xl font-bold mt-3 mb-5">Community Bulletin</h1>
                        <button onClick={(e) => create(e)} className="absolute p-5 rounded-full bg-emerald-300 shadow text-white right-4 hover:bg-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>    
                        </button>
                    </div>

                    {/* <p>{JSON.stringify(bulletins)}</p> */}
                
                    <div className="w-full">
                        {JSON.stringify(bulletins)==='[]' ? (
                            <div className="flex flex-col justify-center items-center mx-auto p-5 text-slate-600 font-dongji">
                                <h1>It's lonely in here <span className="text-2xl">😔</span></h1>
                                <h2>Add a post for your community to see</h2>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center mx-auto p-5 font-dongji">
                                {bulletins.map((thisBulletin) => (
                                    <React.Fragment key={[thisBulletin._id,thisBulletin.upvotes,thisBulletin.downvotes]}>
                                        <BulletinRow
                                            key = {[thisBulletin._id,thisBulletin.upvotes,thisBulletin.downvotes]}
                                            width={'wide'}
                                            up={thisBulletin.upvotes}
                                            down={thisBulletin.downvotes}
                                            statement={thisBulletin.statement}
                                            body={thisBulletin.body}
                                            quotes={thisBulletin.comments}
                                            mapEnabled={thisBulletin.map}
                                            postid={thisBulletin._id}
                                            timestamp={unixToReg(thisBulletin.timestamp)}
                                            action={[thisBulletin?.useractions[0]?.action?.upvote||null, thisBulletin?.useractions[0]?.action?.downvote||null]}
                                            uid={user.uid}
                                            handleOpen={(a,b) => handleOpen(a,b)}
                                            open={opened.has(thisBulletin._id)?opened.get(thisBulletin._id):false}
                                            isAuthor={thisBulletin.author.authorID == user.uid}
                                        >
                                            <iframe name="map" width="450" height="300" className="hidden mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src={thisBulletin.mapLink} key={thisBulletin.mapLink}></iframe> 
                                            <p>{thisBulletin.dongjikey}</p>
                                        </BulletinRow>
                                    </React.Fragment>
                                ))}
                            </div>    
                        )}       
                    </div>
                    {/* <p>{console.log('opened is reset!',opened)}</p> */}
                </>
            )}
        </>
    )
}