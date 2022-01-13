// export a layout block with horizontal flex

export default function BlockX({children}){
    return(
        <div id="introBlock" className="rounded-lg flex mx-auto shadow-lg bg-violet-100 w-2/3 mb-10 font-dongji p-5">
            {children}
        </div>
    )
}