import Link from 'next/link'

export default function Footer(){
    return(
        <footer className="flex justify-center items-center relative bottom-0 w-full text-white">
            <div id="footerWrapper" className="font-bold p-1 flex justify-center items-center w-2/3 bg-violet-400 mx-auto relative text-center rounded-t-md">
                <h1 className="text-white text-2xl select-none">Polly</h1>
                <h1 className="text-2xl">｜</h1>
                <Link href="#"><a>Privacy</a></Link>
                <p className="mx-1">•</p>
                <Link href="/contact"><a>Contact</a></Link>
                <p className="mx-1">•</p>
                <Link href="#"><a>Careers</a></Link>
            </div>
        </footer>
    )
}