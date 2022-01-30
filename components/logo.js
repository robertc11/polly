// exports the Polly logo

export default function Logo({ theme }){
    return(
        <h1 className={ (theme ?? 'dark') ==='dark' ? "text-slate-800 font-bold text-3xl select-none" : "text-white font-bold text-3xl select-none"}>Polly</h1>
    )
}