// React Imports
import React from 'react'

// Next JS Imports
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

// Component Imports
import NavBar from '../components/navbar'
import Footer from '../components/footer'
import BulletinRow from '../components/bulletinRow'

// Content Imports
import abbott from '../public/abbott.png'
import beto from '../public/beto.png'
import perry from '../public/perry.png'


class Home extends React.Component{
    constructor(props){
        super(props)
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
                    <Link href="/login"><a className="mt-5 p-2 bg-slate-800 text-violet-300 rounded-lg duration-200 hover:bg-white hover:text-violet-600">Open In Browser</a></Link>
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
                    <h1 className="text-2xl mb-3.5">Work together to <span className="text-violet-600 font-bold">improve</span> your community</h1>

                    <BulletinRow up={42} down={12} statement={"Neighbors want to Fix the Pothole on 5th and Main"} quotes={['\"Apart from being a hazard to pedestrians, the pothole can cause damage to my car!\" -Diane P.','\"Construction crews have been out and about, but everyone has forgotten about this\" -Anonymous']} mapEnabled={true}>
                        <iframe name="map" width="450" height="300" className="hidden mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src="https://www.google.com/maps/embed/v1/place?q=%2033%C2%B006'06.4%22N%2096%C2%B040'28.2%22W%20&key=AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo"></iframe>
                    </BulletinRow>

                    <BulletinRow up={21} down={2} statement={"Neighbors want More Patrols in Neighborhoods"} quotes={['\"I\'ve seen cars come through that aren\'t from our neighborhood\" -Timothy F.']} mapEnabled={true}>
                        <iframe name="map" width="450" height="300" className="hidden mt-2 rounded border-2 border-violet-300" loading="lazy" allowFullScreen src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJxSD1w2kXTIYRCZO9I1dKQjI&key=AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo"></iframe> 
                    </BulletinRow>

                    <BulletinRow up={5} down={52} statement={"Neighbors want Higher Property Taxes"} quotes={['\"I have too much money; I wouldn\'t mind paying more :)\" -Angel M.', '\"This has to be a joke... right?\" -Kelly H.']} mapEnabled={false} />


                    <h1 className="text-xl w-2/3 text-center text-slate-600 mt-4">Community bulletins help target the problems that matter most to you and your neighbors</h1>

                </div>

                <Footer />
            </>
        )
    }
}

export default Home