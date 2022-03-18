import { useState, useEffect } from 'react'

export default function CreatePostForm(props){
    const [ open,setOpen ] = useState(false)

    useEffect(() => {
        setOpen(props.view)
    }, [props.view])

    const closeHandler = () => {
        setOpen(!open)
        props.onClose()
    }

    return (
        <>
            <div className={ !open ? "hidden fixed opacity-0 top-0 left-0 right-0 bottom-0 bg-slate-600/50 transition-opacity" : "fixed opacity-1 top-0 left-0 right-0 bottom-0 bg-slate-600/75 flex justify-center items-center transition-opacity" }>
                <div className="m-auto bg-white p-10 w-1/2 relative rounded-sm transition-all ease-in-out">
                    <div className="w-full relative h-10">
                        <button onClick={closeHandler} className="text-4xl absolute right-5">&times;</button>
                    </div>
                    <h1 className="text-center font-dongji text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500">Your Shiny New Post</h1>
                    <form onSubmit={props.onSubmit} className="flex flex-col">
                        <label className="w-2/3 mx-auto mt-3">Your Title:</label>
                        <input className="w-2/3 mx-auto border-2 border-slate-600 rounded-sm p-1" 
                            type="text"
                            name="title"
                            placeholder=" I love kitties!" 
                        />

                        <label className="w-2/3 mx-auto mt-3">Tell Us More:</label>
                        <textarea className="w-2/3 mx-auto border-2 border-slate-600 rounded-sm p-1" 
                            type="text" 
                            name="textContent"
                            placeholder=" My cats love..."
                        />

                        <p className={props.errormsg===''?'hidden':'text-violet-400 mx-auto'}>{props.errormsg}</p>
                        
                        <div className="w-full flex items-center justify-center mt-3">
                            <button type="submit" className="w-1/6 mt-3 px-1 py-2 bg-emerald-300 rounded-md mr-1">Create!</button>
                            <button className="w-1/6 mt-3 px-1 py-2 bg-slate-300 rounded-md ml-1" onClick={closeHandler}>Cancel</button>                           
                        </div>
                    </form>
                </div>
            </div>
        </>
    )    

    
}