import { execOnce } from 'next/dist/shared/lib/utils';
import React, {useState, useEffect} from 'react';
import BlockY from '../components/blockY'
import NavBar from '../components/navbar'

export default function blogPage() {

    

    const [body, setBody] = useState("")
    const [count, setCount] = useState(0)
    const [title, setTitle] = useState("")
    const [sub, setSub] = useState("")

    const blogDataPayLoad = {

        blogTitle: title,
        blogSubHeading: sub, 
        blogBody: body
    }

    console.log(body)
    console.log(blogDataPayLoad)

    const handleChange = (e, request, response) =>{
        e.preventDefault()
        let PL = blogDataPayLoad
        console.log("handleChange +++++++ ", PL)

        //let blogSubmit = blogAPI()
        try {
            fetch('/api/blogs/blog.api', {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(PL)
            })
                //.then(response => response.json())
                   .then(response => response.json())
                    //console.log(JSON.stringify(response.json())
                .then(response => {
                    console.log("Successful blog Post!", response)
             
                })
        } catch (err) {
            console.log("robs err argh!", err)
        }

    }

    
   return (
       <>
    <head>
        <title> Create Blog Post </title>
    </head>
    <NavBar />
    <BlockY>
  <form className="w-full p-5 flex flex-col justify-center items-center font-kelly text-slate-600">
      <div className="flex flex-col justify-center items-center animate-fadedongji w-full">
  <h1 className="mt-10 mb-5 text-5xl text-transparent w-full text-center bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-700 font-bold">Create Post.</h1>
  <p>{count}</p>
  {/* <h1 className="mb-5 text-xl peer">Let's get started...</h1> */}
  <label className="w-1/2 mx-auto">Post Title</label>
  <input  className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1" type="text" name="city" placeholder=" Allen" onChange={e => setTitle(e.target.value)} required />
  <label className="w-1/2 mx-auto">Post Subtitle</label>
  <input  className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1" type="text" name="city" placeholder=" Allen" onChange={e => setSub(e.target.value)} required />
  <label className="w-1/2 mx-auto">Post Body</label>
  {/* <input className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1 h-72" type="text" name="city" placeholder=" Polly is excited to have community that loves to Blog!&#10;You can start typing you next novela here :)" required /> */}
  <textarea className="rounded border-2 border-violet-300 w-1/2 mx-auto mb-3 p-1 h-72" type="text" name="city" placeholder=" Polly is excited to have community that loves to Blog!&#10;You can start typing you next novela here :)" onChange={e => setBody(e.target.value)} required></textarea>
  {/* <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={() => setCount(count + 1)}  >Make History</button> */}
  <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={(handleChange)}  >Make History</button>


  </div>
 


  </form>
  </BlockY>
  </>

 
                
   )


}