import Link from 'next/link'

export default function ElectionBlock(props){
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
    
    const date = new Date(props.electionDate)
    return (
        <>
            <div className="w-[49.5%] xl:w-[33%] border-2 border-gray-300 p-2 font-dongji mt-1 rounded">
                <Link href=''><a><h1 className="font-semibold hover:text-violet-500">{props.electionName}</h1></a></Link>
                <p className="">{days[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
                
                <div className="flex items-center mt-3 space-x-1.5">
                    <button onClick={() => null} className="border-2 border-gray-300 p-1 rounded-full group hover:border-violet-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                    </button>

                    <button onClick={() => null} className="border-2 border-gray-300 p-1 rounded-full group hover:border-violet-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </button>

                    <button onClick={() => null} className="border-2 border-gray-300 p-1 rounded-full group hover:border-violet-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                </div>
                <small className="text-xs text-slate-600">
                    Share, Email, or Add to Calendar
                </small>
            </div>
        </>
    )
}