import BulletinRow from '../components/bulletinRow'
import { getCurrentUnix, unixToReg } from '../lib/timestamp'
import Swal from 'sweetalert2'
import React, { useState } from 'react'
import fetchJson from '../lib/fetchJson'
import Router from 'next/router'
import * as user from '../lib/useUser'



export default function BulletinDash(props) {


    const [opened, setOpened] = useState(new Map())
    const [popup, setPopup] = useState(false)
    const [error, setError] = useState('')

    const { bulletins, getNewBulletins } = props
    console.log("bulletins robbbbb: ", bulletins)

    const handleOpen = (postid, value) => {
        setOpened(opened.set(postid, value))
        console.log('opened is changed!', opened)
    }
    
    // const { bulletins } = useBulletin(user)
    //const { bulletins } = props.bulletins


    return (
        <>
            {bulletins !== undefined && (
                <>
                    <div className="flex items-center relative w-full">
                        <h1 className="text-slate-700 text-center w-full text-4xl font-bold mt-3 mb-5">Community Bulletin</h1>
                        <button onClick={() => Router.push("/createPostPage")} className="absolute p-5 rounded-full bg-emerald-300 shadow text-white right-4 hover:bg-emerald-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>

                    {/* <p>{JSON.stringify(bulletins)}</p> */}

                    <div className="w-full">
                        {JSON.stringify(bulletins) === '[]' ? (
                            <div className="flex flex-col justify-center items-center mx-auto p-5 text-slate-600 font-dongji">
                                <h1>It's lonely in here <span className="text-2xl">😔</span></h1>
                                <h2>Add a post for your community to see</h2>
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center items-center mx-auto p-5 font-dongji">
                                {bulletins.map((thisBulletin) => (
                                    <React.Fragment key={[thisBulletin._id, thisBulletin.upvotes, thisBulletin.downvotes]}>
                                        <BulletinRow
                                            key={[thisBulletin._id, thisBulletin.upvotes, thisBulletin.downvotes]}
                                            width={'wide'}
                                            up={thisBulletin.upvotes}
                                            down={thisBulletin.downvotes}
                                            statement={thisBulletin.statement}
                                            body={thisBulletin.body}
                                            quotes={thisBulletin.comments}
                                            mapEnabled={thisBulletin.map}
                                            postid={thisBulletin._id}
                                            timestamp={unixToReg(thisBulletin.timestamp)}
                                            action={[thisBulletin?.useractions[0]?.action?.upvote || null, thisBulletin?.useractions[0]?.action?.downvote || null]}
                                            uid={user.uid}
                                            handleOpen={(a, b) => handleOpen(a, b)}
                                            open={opened.has(thisBulletin._id) ? opened.get(thisBulletin._id) : false}
                                            isAuthor={thisBulletin.author.authorID == user.uid}
                                            getNewBulletins={getNewBulletins}
                                        >
                                            <iframe name="map" width="450" height="300" className="hidden mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src={thisBulletin.mapLink} key={thisBulletin.mapLink}></iframe>

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