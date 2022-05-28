import { render } from 'react-dom'
import BlockY from '../components/blockY'
import NavBar from '../components/navbar'
import { blogPost2 } from '../lib/blogData'
import Head from 'next/head';


export default function blogHome() {

    

    return(
        <>
       
            <head>
                <title>Polly Blog Home</title>
            </head>
            <NavBar />
            <main>
            <div className="flex flex-col justify-center items-center animate-fadedongji w-full"> 
            <h1 className="mt-10 mb-5 text-5xl text-transparent w-full text-center bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-700 font-bold">Blog Home.</h1>
           
            </div>
            </main>

           <div>
               {blogPost2.map((item) => (

           
                   <div key={item.title}>
                   <div>{item.title}</div>
                   <div>{item.date.toString()}</div>
                   <div>{item.content}</div>

                
               </div>
               
               ))};
           </div>
           

        </>
    )
}

