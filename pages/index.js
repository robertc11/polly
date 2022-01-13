import React, {useState} from 'react'

import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import NavBar from '../components/navbar'
import Footer from '../components/footer'

import abbott from '../public/abbott.png'
import beto from '../public/beto.png'
import perry from '../public/perry.png'


class Home extends React.Component{
    constructor(props){
        super(props)

        this.toggleMap = this.toggleMap.bind(this)
    }

    toggleMap(e){
        let el = e.currentTarget
        let parent = el.parentElement.parentElement
        let map = parent.children.namedItem('map')
        let mapClassList = map.classList
        if(mapClassList.contains('hidden')){
            mapClassList.remove('hidden')
        }else{
            mapClassList.add('hidden')
        }
        
    }

    render(){
        return (
            <>
                <Head>
                    <title>Polly</title>
                </Head>

                <NavBar />

                <div id="mainBlock" className="rounded-lg flex flex-col justify-center items-center mx-auto shadow-lg bg-violet-100 w-2/3 mb-10 p-5 font-dongji">
                    <h1 className="mt-5 text-slate-600 text-lg"><span className="text-slate-800 font-bold text-2xl">Polly, </span>A new way to approach politics.</h1>
                    <Link href="/"><a className="mt-5 p-2 bg-slate-800 text-violet-300 rounded-lg duration-200 hover:bg-white hover:text-violet-600">Open In Browser</a></Link>
                </div>


                <div id="introBlock" className="rounded-lg flex mx-auto shadow-lg bg-violet-100 w-2/3 mb-10 font-dongji">
                    <div className="rounded-tl-lg rounded-bl-lg bg-blue-200 w-1/2">
                        
                    </div>
                    <div className="text-slate-600 w-1/2 p-5">
                        <h1 className="text-2xl">Introducing <span className="text-slate-800 font-bold">Polly!</span></h1>
                        <p className="mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>


                <div id="cardsBlock" className="rounded-lg flex flex-col justify-center items-center mx-auto shadow-lg bg-violet-100 w-2/3 p-5 font-dongji mb-10">
                    <h1 className="text-2xl">Politics with ultimate <span className="duration-200 text-violet-600 font-bold hover:text-white">transparency</span></h1>

                    <ul className="flex justify-around mt-5 marker:text-violet-500 text-slate-600">
                        <li className="flex justify-center flex-col items-center p-5 bg-white shadow rounded-md m-2">
                            <div className="w-1/2">
                                <Image className="rounded-full" src={abbott} alt="Portrait of Greg Abbott" />
                            </div>
                            <h2 className="text-lg text-black">Greg Abbott</h2>
                            <h3 className="text-red-500">Republican</h3>

                            <ul className="list-disc">
                                <li>Anti-Abortion <Link href="https://gov.texas.gov/news/post/governor-abbott-attorney-general-paxton-public-camping-ban-must-be-enforced"><a className="text-sky-500 text-xs">[1]</a></Link></li>
                                <li>Pro Second Amendment</li>
                                <li>Corporate Friend</li>
                            </ul>

                            <Link href="#"><a className="mt-2 text-sky-500 font-medium hover:font-bold">Learn More</a></Link>
                        </li>

                        <li className="flex justify-center flex-col items-center p-5 bg-white shadow rounded-md m-2">
                            <div className="w-1/2">
                                <Image className="rounded-full" src={beto} alt="Portrait of Greg Abbott" />
                            </div>
                            <h2 className="text-lg text-black">Beto O'Rourke</h2>
                            <h3 className="text-blue-500">Democrat</h3>

                            <ul className="list-disc">
                                <li>Abolish Capital Punishment</li>
                                <li>Pro Abortion</li>
                                <li>Raise Minimum Wage</li>
                            </ul>

                            <Link href="#"><a className="mt-2 text-sky-500 font-medium hover:font-bold">Learn More</a></Link>
                        </li>

                        <li className="flex justify-center flex-col items-center p-5 bg-white shadow rounded-md m-2">
                            <div className="w-1/2">
                                <Image className="rounded-full" src={perry} alt="Portrait of Greg Abbott" />
                            </div>
                            <h2 className="text-lg text-black">Rick Perry</h2>
                            <h3 className="text-red-500">Republican</h3>

                            <ul className="list-disc">
                                <li>Against Illegal Immigration</li>
                                <li>Restriction on Abortions</li>
                                <li>Lower Corporate Taxes</li>
                            </ul>

                            <Link href="#"><a className="mt-2 text-sky-500 font-medium hover:font-bold">Learn More</a></Link>
                        </li>
                    </ul>

                    <h1 className="text-xl w-2/3 text-center text-slate-600 mt-1.5">Calling cards for politicians provide a digestible way for you to choose between candidates in your next election</h1>
                </div>


                <div id="bulletinBlock" className="rounded-lg flex flex-col justify-center items-center mx-auto shadow-lg bg-violet-100 w-2/3 p-5 font-dongji mb-10">
                    <h1 className="text-2xl">Work together to <span className="text-violet-600 font-bold">improve</span> your community</h1>

                    <details className="mt-5 w-4/5 text-center bg-white open:ring-1 open:ring-black/5 p-6 rounded-lg" closed>
                        <summary className="text-sm leading-6 text-slate-600 font-semibold select-none">
                            <span className="font-bold text-emerald-500">42</span> Neighbors want to Fix the Pothole on 5th and Main
                        </summary>
                        <div className="mt-3 flex flex-col items-center justify-center text-sm leading-6 text-slate-500">
                            <div id="bulletinText" class="mb-3 leading-loose">
                                <p>"Apart from being a hazard to pedestrians, the pothole can cause damage to my car!" -Diane P.</p>
                                <p>"Construction crews have been out and about, but everyone has forgotten about this" -Anonymous</p>
                            </div>
                            
                            <div id="bulletinButtons" class="flex items-center justify-center">
                                <button className="mt-2 rounded-lg shadow px-2 py-1 hover:bg-sky-100 mx-1" onClick={this.toggleMap}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </button>

                                <button className="mt-2 rounded-lg shadow px-2 py-1 bg-emerald-100 hover:bg-sky-100 mx-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                </button>

                                <button className="mt-2 rounded-lg shadow px-2 py-1 bg-red-100 hover:bg-sky-100 mx-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                    </svg>
                                </button>    
                            </div>
                            
                            <iframe id="testMap" name="map" width="450" height="300" className="hidden mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src="https://www.google.com/maps/embed/v1/place?q=%2033%C2%B006'06.4%22N%2096%C2%B040'28.2%22W%20&key=AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo"></iframe>
                        </div>
                    </details>

                    <details className="mt-1.5 w-4/5 text-center bg-white open:ring-1 open:ring-black/5 p-6 rounded-lg" closed>
                        <summary className="text-sm leading-6 text-gray-900 dark:text-slate-600 font-semibold select-none">
                            <span className="font-bold text-emerald-500">21</span> Neighbors want More Patrols in Neighborhoods
                        </summary>
                        <div className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            <p>The mug is round. The jar is round. They should call it Roundtine.</p>
                        </div>
                    </details>

                    <details className="mt-1.5 w-4/5 text-center bg-white open:ring-1 open:ring-black/5 p-6 rounded-lg" closed>
                        <summary className="text-sm leading-6 text-gray-900 dark:text-slate-600 font-semibold select-none">
                            <span className="font-bold text-emerald-500">5</span> Neighbors want Higher Property Taxes
                        </summary>
                        <div className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                            <p>The mug is round. The jar is round. They should call it Roundtine.</p>
                        </div>
                    </details>


                    <h1 className="text-xl w-2/3 text-center text-slate-600 mt-4">Community bulletins help target the problems that matter most to you and your neighbors</h1>

                </div>

                <Footer />
            </>
        )
    }
}

export default Home