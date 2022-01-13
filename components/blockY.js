// exports a layout block with vertical flex

export default function BlockY({children}){
    return(
        <div id="bulletinBlock" className="rounded-lg flex flex-col justify-center items-center mx-auto shadow-lg bg-violet-100 w-2/3 p-5 font-dongji mb-10">
            {children}
        </div>
    )
}