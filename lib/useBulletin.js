import useSWR from 'swr'

export default function useBulletin(user){
    const {data: bulletins} = useSWR(user?.isLoggedIn ? '/api/bulletin' : null)

    return { bulletins }
}