import Head from 'next/head'
import Link from 'next/link'
import NavBar from '../components/navbar'
import BlockX from '../components/blockX'
import Logo from '../components/logo'
import Footer from '../components/footer'

export default function contact(){
    return(
        <>
            <Head>
                <title>Contact</title>
            </Head>

            <div className="h-screen -mb-10">
                <NavBar />

                <BlockX>
                    <div id="right" className="flex flex-col items-center justify-center w-1/3 text-slate-600">
                        <Logo />
                        <h1 className="mt-1">550 S Watters Rd.</h1>
                        <h1>Allen, TX</h1>
                    </div>

                    <div id="left" className="w-2/3 border-l-2 border-violet-500 p-5 flex flex-col justify-center">
                        <li className="flex justify-evenly">
                            <ul className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>

                                <p className="text-center mt-2">dongji.yang@outlook.com</p>
                                <p className="text-center mt-1">rob@gouya.biz</p>
                            </ul>
                            
                            <ul className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>

                                <p className="text-center mt-2">(469) 974-4279</p>
                            </ul>

                            <ul className="flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>

                                <Link href="https://github.com/"><a className="mt-2 text-center">GitHub</a></Link>
                            </ul>
                        </li>
                                                
                    </div>
                </BlockX>

            </div>

            <Footer/>
            
        </>  
    )
}