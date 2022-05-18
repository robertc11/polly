import NavBar from '../components/navbar'
import Head from 'next/head'

export default function Regions(){
    return (
        <>
            <Head>
                <title>Regions</title>
            </Head>

            <NavBar />

            <div className="font-dongji w-full">
                <h1 className="text-3xl font-bold text-center text-slate-700 mt-10">Supported Regions</h1>

                <p className="w-7/12 mx-auto mt-3 text-lg">
                    Don't see your city on the list? Just because your city isn't here doesn't mean you won't receive election data. 
                    It just means that the team at Polly can't meticulously check to see if all the data is there. 
                    If you want greater reliability and access, you can add your city by either:
                </p>
                <ul className="w-[55%] mx-auto mt-3 text-lg space-y-2 marker:text-violet-400 list-disc">
                    <li>
                        Emailing <code className="text-sm">support@pollyapp.io</code> with your city's name 
                        and your zipcode
                    </li>
                    <li>
                        Filling out our regional support ticket request form
                    </li>
                </ul>
                <p className="w-7/12 mx-auto mt-2 text-lg">
                    Please note: due to our limited size and staffing constraints, not all ticket requests can be approved instantly.
                    We thank you for your understanding and patience.
                </p>
                
                <h2 className="mt-10 w-7/12 mx-auto text-xl font-semibold">Texas</h2>
                <table className="font-arial border-collapse border border-slate-500 w-7/12 mx-auto">
                    <tr className="bg-slate-500 text-white">
                        <th className="border border-slate-400 p-2">County</th>
                        <th className="border border-slate-400 p-2">City</th>
                        <th className="border border-slate-400 p-2">City ID</th>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Allen</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Allen"]</td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Plano</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Plano"]</td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200"> 
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Mckinney</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Mckinney"]</td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Carrollton</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Carrollton"]</td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Dallas</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Dallas"]</td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Frisco</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Frisco"]</td>
                    </tr>
                    <tr className="bg-white even:bg-slate-200">
                        <td className="border border-slate-400 p-2">Collin</td>
                        <td className="border border-slate-400 p-2">Richardson</td>
                        <td className="border border-slate-400 p-2">["USA","TX","Collin","Richardson"]</td>
                    </tr>
                </table>
            </div>
        </>
    )
}