// template file - refer to useBulletin.js
import useSWR from 'swr'

export default function useElections(user){

    const {data: elections} = useSWR(
        user?.isLoggedIn ? 
        `/api/web/elections?country=${user.cityID[0]}&state=${user.cityID[1]}&county=${user.cityID[2]}&city=${user.cityID[3]}` 
        : null,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            shouldRetryOnError: false,
        }
    )

    return { elections }
}