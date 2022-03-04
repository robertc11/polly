import useSWR from 'swr'

export default function useBulletin(user){
    const hashmap = new Map()
    const fetcher = url => fetch(url).then(r => r.json())
    const {data: bulletins} = useSWR(user?.isLoggedIn ? '/api/bulletin' : null, fetcher, {refreshInterval: 5000})
    //console.log('this is bulletins!',bulletins)
    if(bulletins!==undefined){
        try{
            bulletins.forEach(element => {
                //console.log('single bulletin row', element)
                const desiredKey = element.upvotes-element.downvotes
                while(hashmap.get(desiredKey)!==undefined){  // keep hashing until a value is found
                    desiredKey = hashfunction(desiredKey)
                }
                hashmap.set(desiredKey,element)
                element.dongjikey = desiredKey
            });    
        }catch(err){
            console.log('this was the err in forEach',err)
        }
        
    }
    //console.log('this is the hashmap',hashmap)
    return { bulletins }
}

export function hashfunction(num){
    return Math.floor(1000*((0.618033*num) % 1))
}