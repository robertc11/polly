import { useEffect } from "react"

export default function useUpdatesBulletin(postid,uid,deltaUp,deltaDown,upvoteSelected,downvoteSelected,changed){
    useEffect(() => {
        const sendData = async (data) => {
            console.log('this is the map!', data)
            await fetch("/api/editbulletin", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            })
        }

        //console.log('this is the map!',map)
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
    })
}
