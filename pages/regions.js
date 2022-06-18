import NavBar from '../components/navbar'
import Head from 'next/head'
import Link from 'next/link'

export default function Regions(){
    return (
        <>
            <Head>
                <title>Regions</title>
            </Head>

            <NavBar />

            <div className="font-dongji w-full mb-10">
                <h1 className="text-3xl font-bold text-center text-slate-700 mt-10">Supported Regions</h1>

                <p className="w-7/12 mx-auto mt-3 text-lg">
                    Don't see your city on the list? No need to panic! Just because your city isn't here doesn't mean you won't receive election data. 
                    It just means that the team at Polly can't take out our microscope and meticulously check to see if all the data is there. 
                    If you want greater reliability and access to local election data, you can add your city by either:
                </p>
                <ul className="w-[55%] mx-auto mt-3 text-lg space-y-2 marker:text-violet-400 list-disc">
                    <li>
                        Emailing <code className="text-sm">support@pollyapp.io</code> with your city's name 
                        and your zipcode
                    </li>
                    <li>
                        Filling out our regional support ticket request form*
                    </li>
                </ul>
                <p className="w-7/12 mx-auto mt-2 text-lg">
                    If you want to report a missing election for any region, 
                    visit <Link href="/"><a className="text-sky-400">election hide-and-seek</a></Link>.
                </p>
                <p className="w-7/12 mx-auto mt-2 text-sm">
                    *Please note: due to our limited size and staffing constraints, not all ticket requests can be approved instantly.
                    We thank you for your understanding and patience.
                </p>
                
                <h2 className="mt-10 w-7/12 mx-auto text-xl font-semibold">Texas</h2>
                <table className="font-arial border-collapse border border-slate-500 w-7/12 mx-auto">
                    <tr className="bg-slate-500 text-white">
                        <th className="border border-slate-400 p-2">County</th>
                        <th className="border border-slate-400 p-2">City</th>
                        <th className="border border-slate-400 p-2">City ID</th>
                        <th className="border border-slate-400 p-2">Status</th>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Allen</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Allen"]</td>
                        <td className="border border-slate-400 p-2">
                            <div className="flex items-center text-amber-500 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Maintenance 
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Plano</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Plano"]</td>
                        <td className="border border-slate-400 p-2">
                            <div className="flex items-center text-emerald-500 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Online    
                            </div>
                        </td>   
                    </tr>
                    <tr className="bg-white even:bg-slate-200"> 
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Mckinney</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Mckinney"]</td>
                        <td className="border border-slate-400 p-2">
                            <div className="flex items-center text-amber-500 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Maintenance
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Carrollton</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Carrollton"]</td>
                        <td className="border border-slate-400 p-2">
                            <div className="flex items-center text-red-500 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Offline    
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Dallas</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Dallas"]</td>
                        <td className="border border-slate-400 p-2">
                            <div className="flex items-center text-red-500 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Offline    
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Frisco</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Frisco"]</td>
                        <td className="border border-slate-400 p-2">
                            <div className="flex items-center text-amber-500 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Maintenance
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Richardson</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Richardson"]</td>
                        <td className="border border-slate-400 p-2">
                            <div className="flex items-center text-amber-500 justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Maintenance   
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </>
    )
}