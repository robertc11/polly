
import { useState, useEffect, useRef } from 'react'
import useOnScreen from '../lib/useOnScreen'
import useSWRInfinite from 'swr/infinite'


const PAGE_SIZE = 10

const getKey = (pageIndex, previousPageData, pageSize) => {
    if(previousPageData && !previousPageData.length) return null

    return `/api/posts/bulletin?per_page=${pageSize}&page=${pageIndex+1}`
}

const fetcher = url => fetch(url).then(r => r.json())


export default function Dummypages(){
    const ref = useRef()
    const isVisible = useOnScreen(ref)

    const {data, error, mutate, size, setSize, isValidating} = useSWRInfinite(
        (...args) => getKey(...args, PAGE_SIZE),
        fetcher,
        {
            // refreshInterval: 5000,
            revalidateIfStale: false,
        }
    )

    const bulletins = data ? [].concat(...data) : []
    const isLoadingInitialData = !data && !error
    const isLoadingMore = isLoadingInitialData || (size>0 && data && typeof data[size-1]==='undefined')
    const isEmpty = data?.[0]?.length === 0
    const isReachingEnd = size === PAGE_SIZE
    const isRefreshing = isValidating && data && data.length === size

    useEffect(() => {
        if(isVisible && !isReachingEnd && !isRefreshing){
            setSize(size+1)
        }
    }, [isVisible, isRefreshing])

    return(
        <>
            {bulletins.map((one) => (
                <div className="p-10" key={one._id}>{JSON.stringify(one)}<hr></hr></div>
            ))}
            <div className="w-full text-bold text-center" ref={ref}>
                reference
            </div>
        </>

    )
}