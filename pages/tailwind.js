import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

import abbott from '../public/abbott.png'
import beto from '../public/beto.png'
import perry from '../public/perry.png'

export default function tailwindTest(){
    return (
        <>
            <Head>
                <title>Test Home</title>
            </Head>

                <div id="nav" class="flex items-center text-violet-500 font-dongji font-semibold w-2/3 mx-auto">
                    <h1 class="text-slate-800 font-bold text-2xl mr-2 select-none">Polly</h1>
                    <Link href="/"><a class="p-5 hover:text-blue-200">HOME</a></Link>
                    <Link href="/"><a class="p-5 hover:text-blue-200">SUPPORT</a></Link>
                    <Link href="/"><a class="p-5 hover:text-blue-200">DOWNLOAD</a></Link>
                </div>


                <div class="rounded-lg flex flex-col justify-center items-center mx-auto shadow-lg bg-violet-100 w-2/3 mb-10 p-5 font-dongji">
                    <h1 class="mt-5 text-slate-600 text-lg"><span class="text-slate-800 font-bold text-2xl">Polly, </span>A new way to approach politics.</h1>
                    <Link href="/"><a class="mt-5 p-2 bg-slate-800 text-violet-300 rounded-lg duration-200 hover:bg-white hover:text-violet-600">Open In Browser</a></Link>
                </div>


                <div class="rounded-lg flex mx-auto shadow-lg bg-violet-100 w-2/3 mb-10 font-dongji">
                    <div class="rounded-tl-lg rounded-bl-lg bg-blue-200 w-1/2">
                        
                    </div>
                    <div class="text-slate-600 w-1/2 p-5">
                        <h1 class="text-2xl">Introducing <span class="text-slate-800 font-bold">Polly!</span></h1>
                        <p class="mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </div>


                <div class="rounded-lg flex flex-col justify-center items-center mx-auto shadow-lg bg-violet-100 w-2/3 p-5 font-dongji">
                    <h1 class="text-2xl">Politics with ultimate <span class="duration-200 text-violet-600 font-bold hover:text-white">transparency</span></h1>

                    <ul class="flex justify-around mt-5">
                        <li class="flex justify-center flex-col items-center p-5 bg-white shadow rounded-md m-2">
                            <div class="w-1/2">
                                <Image class="rounded-full" src={abbott} alt="Portrait of Greg Abbott" />
                            </div>
                            <h2 class="text-lg">Greg Abbott</h2>
                            <h3 class="text-red-500">Republican</h3>

                            <ul class="list-disc">
                                <li>Anti-Abortion <Link href="https://gov.texas.gov/news/post/governor-abbott-attorney-general-paxton-public-camping-ban-must-be-enforced"><a class="text-sky-500 text-xs">[1]</a></Link></li>
                                <li>Pro Second Amendment</li>
                                <li>Corporate Friend</li>
                            </ul>
                        </li>

                        <li class="flex justify-center flex-col items-center p-5 bg-white shadow rounded-md m-2">
                            <div class="w-1/2">
                                <Image class="rounded-full" src={beto} alt="Portrait of Greg Abbott" />
                            </div>
                            <h2 class="text-lg">Beto O'Rourke</h2>
                            <h3 class="text-blue-500">Democrat</h3>

                            <ul class="list-disc">
                                <li>Abolish Capital Punishment</li>
                                <li>Pro Abortion</li>
                                <li>Raise Minimum Wage</li>
                            </ul>
                        </li>

                        <li class="flex justify-center flex-col items-center p-5 bg-white shadow rounded-md m-2">
                            <div class="w-1/2">
                                <Image class="rounded-full" src={perry} alt="Portrait of Greg Abbott" />
                            </div>
                            <h2 class="text-lg">Rick Perry</h2>
                            <h3 class="text-red-500">Republican</h3>

                            <ul class="list-disc">
                                <li>Against Illegal Immigration</li>
                                <li>Restriction on Abortions</li>
                                <li>Lower Corporate Taxes</li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <footer>
                    <p></p>
                </footer>
        </>
    )
}