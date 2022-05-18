import { useEffect, useState } from 'react'

export default function CustomPopup(props){
    const [show, setShow] = useState(false)

    const closeHandler = () => {
        setShow(false)
        props.onClose(false)
    }

    useEffect(() => {
        setShow(props.show)
    }, [props.show])

    return (
        <div className={show?"visible opacity-1 fixed top-0 bottom-0 left-0 right-0 bg-black/[0.7] z-50 flex items-center justify-center":"hidden opacity-0 fixed fixed top-0 bottom-0 left-0 right-0 bg-black/[0.7] z-50 flex items-center justify-center"}>
            <div className="bg-white mx-auto rounded w-[60%] xl:w-[47%] relative p-5 flex flex-col items-center">
                <h2 className="text-xl font-semibold">{props.title}</h2>
                <span onClick={closeHandler} className="absolute top-0 right-3 text-3xl cursor-pointer">
                    &times;
                </span>
                <div>{props.children}</div>
                <button className="text-white text-md px-3 py-1 rounded bg-violet-500 mt-2" onClick={closeHandler}>Close</button>
            </div>
        </div>
    )
}