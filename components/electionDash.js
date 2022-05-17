//import useElections from "../lib/useElections"
import ElectionBlock from "./electionBlock"

export default function ElectionDash(props){

    const user = {
        uid: props.uid,
        username: props.username,
        cityID: props.cityid,
        isLoggedIn: props.login,
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
            {/* <p>{JSON.stringify(allElections)}</p> */}
            {/* <p className="text-xs">{JSON.stringify(props.elections)}</p> */}
            <div className="w-full px-10">
                <h1 className="text-xl font-semibold mt-5 flex items-center">
                    City
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="#FFAC1C">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </h1>
                <div className="w-full flex flex-wrap items-center justify-between">
                    {allElections.map((thisElection, index) => {
                        var tmp = thisElection.ocdDivisionId.split('/')
                        if(tmp.length > 0 && tmp[tmp.length-1].includes('city')){
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="#FFAC1C">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </h1>
                <div className="w-full flex flex-wrap items-center justify-between">
                    {allElections.map((thisElection, index) => {
                        var tmp = thisElection.ocdDivisionId.split('/')
                        if(tmp.length > 0 && tmp[tmp.length-1].includes('county')){
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="#FFAC1C">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </h1>
                <div className="w-full flex flex-wrap items-center justify-between">
                    {allElections.map((thisElection, index) => {
                        var tmp = thisElection.ocdDivisionId.split('/')
                        if(tmp.length > 0 && tmp[tmp.length-1].includes('state')){
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="#FFAC1C">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                </h1>
                <div className="w-full flex flex-wrap items-center justify-between">
                    {allElections.map((thisElection, index) => {
                        var tmp = thisElection.ocdDivisionId.split('/')
                        if(tmp.length > 0 && tmp[tmp.length-1].includes('country')){
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
