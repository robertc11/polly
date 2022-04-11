import useSWR from 'swr'

export default function useBulletin(user){
    const fetcher = url => fetch(url).then(r => r.json())
    const {data: bulletins} = useSWR(user?.isLoggedIn ? '/api/bulletin' : null, fetcher, {
        refreshInterval: 5000,
        revalidateIfStale: false,
    })

    return { bulletins }
}

