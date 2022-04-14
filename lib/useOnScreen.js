import { useState, useEffect } from 'react'

export default function useOnScreen(ref){
    const [isIntersecting, setIntersecting] = useState(false)

    useEffect(() => {
        if(!ref.current){
            console.log('didnt run!')
            return
        }

        const observer = new IntersectionObserver(([entry]) => {
            console.log('ran!',entry)
            setIntersecting(entry.isIntersecting)
        })

        observer.observe(ref.current)

        return () => {
            observer.disconnect()
        }
    })

    return isIntersecting
}