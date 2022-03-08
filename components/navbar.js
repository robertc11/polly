//exports the navigation bar

import Link from 'next/link'
import Logo from '../components/logo'
import Icon from './icon'

export default function NavBar(){
    return(
        <div id="navWrapper" className="w-full bg-white sticky top-0 z-50 bg-opacity-95">
            <div id="nav" className="flex items-center text-violet-500 text-md font-dongji font-semibold w-2/3 mx-auto">
                <Icon size={85} />
                <span className="-ml-3"><Logo /></span>
                <Link href="/"><a className="ml-2 p-5 hover:text-blue-200">HOME</a></Link>
                <Link href="/"><a className="p-5 hover:text-blue-200">SUPPORT</a></Link>
                <Link href="/mobilelanding"><a className="p-5 hover:text-blue-200">DOWNLOAD</a></Link>
            </div>
        </div>
    )
}