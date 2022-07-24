import BulletinRow from '../components/bulletinRow'
import { getCurrentUnix, unixToReg } from '../lib/timestamp'
import React, { useState, useRef, useEffect } from 'react'
import Router from 'next/router'
import * as user from '../lib/useUser'

export default function BulletinDash(props){

    const user = {
        uid: props.uid,
        username: props.username,
        cityID: props.cityid,
        isLoggedIn: props.login,
    }


    const { bulletins } = props.bulletins
    

    return (
        <>
            {bulletins !== undefined && (
                <>
                    <div className="flex items-center relative w-full">
                        <h1 className="text-slate-700 text-center w-full text-4xl font-bold mt-3 mb-5">Community Bulletin</h1>
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
                                {bulletins.map((thisBulletin, index) => (
                                    <React.Fragment key={[thisBulletin._id,thisBulletin.upvotes,thisBulletin.downvotes,thisBulletin.comments[0]?.numComments]}>
                                        <BulletinRow
                                            key = {[thisBulletin._id]}
                                            index={index}
                                            width={'wide'}
                                            up={thisBulletin.upvotes}
                                            down={thisBulletin.downvotes}
                                            statement={thisBulletin.statement}
                                            body={thisBulletin.body}
                                            numComments={thisBulletin.comments[0]?.numComments}
                                            mapEnabled={thisBulletin.map}
                                            postid={thisBulletin._id}
                                            timestamp={unixToReg(thisBulletin.timestamp)}
                                            action={[thisBulletin?.useractions[0]?.action?.upvote||false, thisBulletin?.useractions[0]?.action?.downvote||false]}
                                            uid={user.uid}
                                            username={user.username}
                                            isAuthor={thisBulletin.author.authorID == user.uid}
                                            authorName={thisBulletin.author.authorName}
                                            handleOpenPost={(id) => props.handlePost(id)}
                                            attachments={thisBulletin.attachments}
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