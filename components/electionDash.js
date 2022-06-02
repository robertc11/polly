//import useElections from "../lib/useElections"
import ElectionBlock from "./electionBlock"
import CustomPopup from "./customPopup"
import { useState } from 'react'
import Link from 'next/link'

export default function ElectionDash(props){

    const user = {
        uid: props.uid,
        username: props.username,
        cityID: props.cityid,
        isLoggedIn: props.login,
    }

    const [popupVisible, setPopupVisible] = useState(false)
    const popupCloseHandler = (a) => {
        setPopupVisible(a)
    }

    const allElections = [props.elections?.election || ''].concat(props.elections?.otherElections || [])

    return (
        <>
            <div className="flex items-center justify-center w-full">
                <div className="relative px-9">
                    <h1 className="text-slate-700 text-center w-full text-4xl font-bold mt-3 mb-5 flex justify-center">
                        Upcoming Elections
                    </h1>
                    <small className="text-sm font-bold text-violet-400 absolute top-3 right-0">Beta</small>    
                </div>
            </div>
            {/* <p>{user.uid}</p> */}
            <p>{JSON.stringify(allElections)}</p>
            {/* <p className="text-xs">{JSON.stringify(props.elections)}</p> */}

            <CustomPopup
                title="How We Source Our Data"
                onClose={(a) => popupCloseHandler(a)}
                show={popupVisible}
                closeText="Ok"
            >
                <div className="relative">
                    <p className="w-2/3 mx-auto mt-3">
                        To ensure we have the most accurate and up-to-date information on all upcoming elections in your region, Polly uses its own webscrapers for 
                        <Link href='/regions'><a className="text-sky-400"> supported regions</a></Link> and the 
                        <Link href='https://developers.google.com/civic-information'><a className="text-sky-400"> Google Civic API </a></Link> 
                        which is supported by Google and the Voting Information Project. The data is built from the contribution of local government groups and may 
                        be incomplete in some areas.
                    </p>
                    <p className="mt-3 w-2/3 mx-auto">If you notice inconsistencies or missing data, please help us by:</p>
                    <ul className="marker:text-violet-400 w-7/12 mx-auto mt-1 space-y-1 list-disc">
                        <li>Sending an email to <code className="text-sm">support@pollyapp.io</code> with your zipcode and the name of the missing election</li>
                        <li>Submitting a regional support ticket request*</li>
                    </ul>
                    <p className="w-full text-center mt-3 text-xs">*Because of limited staff and resources, we cannot guarantee support for all requested tickets. Thank you for your understanding.</p>    
                </div>
                
            </CustomPopup>
            
            <div className="w-full px-10">
                <h1 className="text-xl font-semibold mt-5 flex items-center">
                    City
                    <button onClick={() => setPopupVisible(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="#FFAC1C">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>    
                    </button>
                </h1>
                <div className="w-full flex flex-wrap items-center justify-between">
                    {allElections?.map((thisElection, index) => {
                        var tmp = thisElection?.ocdDivisionId?.split('/')
                        if(tmp?.length > 0 && tmp?.[tmp?.length-1].includes('city')){
                            return (
                                <ElectionBlock
                                    key={thisElection.id}
                                    electionName={thisElection.name}
                                    electionID={thisElection.id}
                                    electionDate={thisElection.electionDay}
                                />
                            )
                        }
                    })}
                </div>

                <h1 className="text-xl font-semibold mt-5 flex items-center">
                    County
                    <button onClick={() => setPopupVisible(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="#FFAC1C">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>    
                    </button>
                </h1>
                <div className="w-full flex flex-wrap items-center justify-between">
                    {allElections?.map((thisElection, index) => {
                        var tmp = thisElection?.ocdDivisionId?.split('/')
                        if(tmp?.length > 0 && tmp?.[tmp?.length-1].includes('county')){
                            return (
                                <ElectionBlock
                                    key={thisElection.id}
                                    electionName={thisElection.name}
                                    electionID={thisElection.id}
                                    electionDate={thisElection.electionDay}
                                />
                            )
                        }
                    })}
                </div>

                <h1 className="text-xl font-semibold mt-5 flex items-center">
                    State
                    <button onClick={() => setPopupVisible(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="#FFAC1C">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>    
                    </button>
                </h1>
                <div className="w-full flex flex-wrap items-center justify-between">
                    {allElections?.map((thisElection, index) => {
                        var tmp = thisElection?.ocdDivisionId?.split('/')
                        if(tmp?.length > 0 && tmp?.[tmp?.length-1].includes('state')){
                            return (
                                <ElectionBlock
                                    key={thisElection.id}
                                    electionName={thisElection.name}
                                    electionID={thisElection.id}
                                    electionDate={thisElection.electionDay}
                                />
                            )
                        }
                    })}
                </div>

                <h1 className="text-xl font-semibold mt-5 flex items-center">
                    Country
                    <button onClick={() => setPopupVisible(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="#FFAC1C">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>    
                    </button>
                </h1>
                <div className="w-full flex flex-wrap items-center justify-between">
                    {allElections?.map((thisElection, index) => {
                        var tmp = thisElection?.ocdDivisionId?.split('/')
                        if(tmp?.length > 0 && tmp?.[tmp?.length-1].includes('country')){
                            return (
                                <ElectionBlock
                                    key={thisElection.id}
                                    electionName={thisElection.name}
                                    electionID={thisElection.id}
                                    electionDate={thisElection.electionDay}
                                />
                            )
                        }
                    })}
                </div>

            </div>
            {/* {elections !== undefined && (
                <>
                    <div className="flex items-center relative w-full">
                        <h1 className="text-slate-700 text-center w-full text-4xl font-bold mt-3 mb-5">Upcoming Elections</h1>
                    </div>

                    <p className="mb-10">{JSON.stringify(elections)}</p>
                
                    <div className="w-full">
                        <div>
                            <h1>City</h1>
                            <li>
                                {elections.city.map((thisElection,index) => (
                                    <ul key={index}>
                                        <h1>{thisElection.title}</h1>
                                        <p>{thisElection.details}</p>
                                        {thisElection.links.map((thisLink) => (
                                            <Link href={thisLink.link}><a>{thisLink.name}</a></Link>
                                        ))}
                                        <p><span>{thisElection.timestamps.creation} </span> {thisElection.timestamps.target}</p>
                                    </ul>
                                ))}    
                            </li>    
                        </div>
                        
                        <div>
                            <h1>County</h1>
                            <li>
                                {elections.county.map((thisElection,index) => (
                                    <ul key={index}>
                                        <h1>{thisElection.title}</h1>
                                        <p>{thisElection.details}</p>
                                        {thisElection.links.map((thisLink) => (
                                            <Link href={thisLink.link}><a>{thisLink.name}</a></Link>
                                        ))}
                                        <p><span>{thisElection.timestamps.creation} </span> {thisElection.timestamps.target}</p>
                                    </ul>
                                ))}    
                            </li>    
                        </div>

                        <div>
                            <h1>State</h1>
                            <li>
                                {elections.state.map((thisElection,index) => (
                                    <ul key={index}>
                                        <h1>{thisElection.title}</h1>
                                        <p>{thisElection.details}</p>
                                        {thisElection.links.map((thisLink) => (
                                            <Link href={thisLink.link}><a>{thisLink.name}</a></Link>
                                        ))}
                                        <p><span>{thisElection.timestamps.creation} </span> {thisElection.timestamps.target}</p>
                                    </ul>
                                ))}    
                            </li>    
                        </div>

                        <div>
                            <h1>Country</h1>
                            <li>
                                {elections.country.map((thisElection,index) => (
                                    <ul key={index}>
                                        <h1>{thisElection.title}</h1>
                                        <p>{thisElection.details}</p>
                                        {thisElection.links.map((thisLink) => (
                                            <Link href={thisLink.link}><a>{thisLink.name}</a></Link>
                                        ))}
                                        <p><span>{thisElection.timestamps.creation} </span> {thisElection.timestamps.target}</p>
                                    </ul>
                                ))}    
                            </li>    
                        </div>
                    </div>
                </>       
            )} */}
        </>
    )
}
