import useElections from "../lib/useElections"
import Link from "next/link"


export default function ElectionDash(props){

    const user = {
        uid: props.uid,
        username: props.username,
        cityID: props.cityid,
        isLoggedIn: props.login,
    }

    const { elections } = useElections(user)

    return (
        <>
            {elections !== undefined && (
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
            )}
        </>
    )
}