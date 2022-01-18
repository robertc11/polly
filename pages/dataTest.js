import {getElections} from '../lib/civic'
import useUser from '../lib/useUser'
import React from 'react'

export default function dataTestPage({data}){
    const { user } = useUser({
        redirectTo: "/login",
    });

    return(
        <div>
            <h1 className="mb-5">Little Shit</h1>
            <p>{JSON.stringify(user)}</p>
            <ul className="mt-5">
                {data.elections.map((one) => (
                    <li>
                        <h2>{one.id}</h2>
                        <p>{one.name}</p>
                        <p>{one.electionDay}</p>
                        <p>{one.ocdDivisionId}</p>
                    </li>
                ))}
            </ul>

        </div>
    )
}

// class dataTestPage extends React.Component{
//     constructor(props){
//         super(props)
//     }

//     render(){
//         const data = this.props.data
//         return(
//             <div>
//                 <h1>Little Shit</h1>
//                 <ul>
//                     {data.elections.map((one) => (
//                         <li>
//                             <h2>{one.id}</h2>
//                             <p>{one.name}</p>
//                             <p>{one.electionDay}</p>
//                             <p>{one.ocdDivisionId}</p>
//                         </li>
//                     ))}
//                 </ul>

//             </div>
//         )
//     }
// }

export async function getStaticProps(context){
    const data = await getElections()

    return {
        props: { data },
    }
}

// export default dataTestPage