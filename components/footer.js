import Link from 'next/link'
import Icon from './icon'
import Logo from './logo'

export default function Footer(){
    return(
        <footer className="flex justify-center items-center relative bottom-0 w-full py-36 bg-slate-600 text-white">
            <div id="footerWrapper" className="font-bold p-1 flex justify-evenly items-center w-2/3  mx-auto relative rounded-t-md">
                <div id="leftbar" className="flex flex-col justify-center items-center w-1/2">
                    <Icon size={120} />
                    <span className="-mt-8"><Logo theme="light" /></span>
                </div>

                <div id="rightbar" className="flex flex-wrap justify-evenly items-baseline w-1/2 text-left font-light">
                    <div className="flex flex-col justify-center basis-1/3">
                        <h1 className="text-lg font-bold mb-2">Navigation</h1>
                        <Link href="/"><a className="mb-1">Home</a></Link>
                        <Link href="/"><a className="mb-1">Support</a></Link>
                        <Link href="/"><a className="mb-1">Download</a></Link>
                        <Link href="/login"><a className="mb-1">Web App</a></Link>
                    </div>

                    <div className="flex flex-col justify-center basis-1/3">
                        <h1 className="text-lg font-bold mb-2">Learn More</h1>
                        <Link href="/"><a className="mb-1">About</a></Link>
                        <Link href="/contact/#"><a className="mb-1">Contact Us</a></Link>
                        <Link href="/#socials"><a className="mb-1">Socials</a></Link>
                        <Link href="/"><a className="mb-1">Careers</a></Link> 
                    </div>

                    <div className="flex flex-col justify-center basis-1/3">
                        <h1 className="text-lg font-bold mb-2">Documentation</h1>
                        <Link href="/"><a className="mb-1">API</a></Link>
                        <Link href="/"><a className="mb-1">Locations</a></Link>
                        <Link href="/"><a className="mb-1">Demo</a></Link> 
                    </div>

                    <div className="flex flex-col justify-center basis-1/3 mt-10">
                        <h1 className="text-lg font-bold mb-2">Inquiries</h1>
                        <Link href="/"><a className="mb-1">For Politicians</a></Link>
                        <Link href="/"><a className="mb-1">For Communities</a></Link>
                        <Link href="/"><a className="mb-1">For Businesses</a></Link> 
                    </div>

                    <div className="flex flex-col justify-center basis-2/3 mt-10">
                        <h1 className="text-lg font-bold mb-2">Data</h1>
                        <Link href="/"><a className="mb-1">Privacy</a></Link>
                        <Link href="/"><a className="mb-1">Terms and Conditions</a></Link>
                        <Link href="/"><a className="mb-1">Security</a></Link> 
                    </div>
                    
                    
                    
                </div>
            </div>
        </footer>
    )
}