import {getElections} from '../lib/civic'

export default function dataTestPage({data}){
    return(
        <div>
            <h1>Little Shit</h1>
            <ul>
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

export async function getStaticProps(context){
    const data = await getElections()

    return {
        props: { data },
    }
    
}