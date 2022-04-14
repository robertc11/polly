import { useEffect } from "react"

export default function useUpdatesBulletin(postid,uid,deltaUp,deltaDown,upvoteSelected,downvoteSelected,changed,debounceTimeout){
    useEffect(() => {
        const sendData = async (data) => {
            console.log('this is the updated data!', data)
            await fetch("/api/posts/editbulletin", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            })
        }
        
        const handleDebounce = setTimeout(async () => {
            console.log('> useUpdates.js: changed status',changed,postid)
            if(!changed) return
            const thisObj = {
                upDelta: deltaUp,
                downDelta: deltaDown,
                upvoteSelected: upvoteSelected,
                downvoteSelected, downvoteSelected,
                postid: postid,
                uid: uid,
            }
            // this is where you take care of the calls to db
            sendData(thisObj).catch(console.error)  
        }, debounceTimeout)


              
        return () => {
            clearTimeout(handleDebounce)
        }

    }, [deltaUp,deltaDown,debounceTimeout])
}
