// import { useEffect, useState } from 'react'

// const PAGE_SIZE = 4

// //const fetcher = url => fetch(url).then(r => r.json())

// export default function useBulletin(previousPageData){
//     const [bulletins, setBulletins] = useState(null)

//     useEffect(async () => {
//         const fetchData = async () => {
//             let key = 0
//             if(previousPageData?.length > 0){
//                 key = previousPageData?.[previousPageData.length-1]?._id
//             }
//             const bulletinData = await fetch(`/api/posts/getpost?per_page=${PAGE_SIZE}&obj_id=${key}`).then(res => res.json())
//             return bulletinData
//         }

//         const res = await fetchData()
//         console.log('this is bulletins!', res)
//         return res
//     }, [])

// }

