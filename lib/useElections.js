// template file - refer to useBulletin.js
import useSWR from 'swr'

export default function useElections(user){
    const {data: elections} = useSWR(user?.isLoggedIn ? '/api/elections' : null)

    return { elections }
}