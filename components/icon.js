import Image from "next/image"
import Link from "next/link"
import cracker from '../public/cracker.svg'

export default function Icon({theme, size}){
    return (
        <Link href="/"><a><Image src={cracker} alt="Polly Logo" height={size??100} width={size??100} /></a></Link>
    )
}