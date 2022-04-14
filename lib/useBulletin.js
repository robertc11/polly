// import useSWRInfinite from 'swr'

// const PAGE_SIZE = 10

// const getKey = (pageIndex, previousPageData, pageSize) => {
//     if(previousPageData && !previousPageData.length) return null

//     return `/api/bulletin?per_page=${pageSize}&page=${pageIndex+1}`
// }

// export default function useBulletin(user){
//     const fetcher = url => fetch(url).then(r => r.json())

//     const {data: bulletins, error, isValidating, mutate, size, setSize} = useSWRInfinite((...args) => getKey(...args,PAGE_SIZE), fetcher, {
//         refreshInterval: 5000,
//         revalidateIfStale: false,
//     })

//     return { bulletins }
// }

