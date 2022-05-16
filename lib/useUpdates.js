import { useEffect, useState } from "react"

export default function useUpdatesBulletin(postid,uid,up,down,selected,changed,debounceTimeout){
    const [lastSelected, setLastSelected] = useState(selected)
    const [lastUpvote, setLastUpvote] = useState(up)
    const [lastDownvote, setLastDownvote] = useState(down)

    useEffect(() => {
        //console.log('last selected', lastSelected)
        //console.log('current selected', selected)

        const sendData = async (data) => {
            console.log('this is the updated data!', data)
            await fetch("/api/posts/editvote", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data),
            })
            setLastSelected(selected)
            setLastUpvote(up)
            setLastDownvote(down)
        }
        
        const dataHelper = async () => {
            //console.log('> useUpdates.js: changed status',changed,postid)
            //console.log('comparing votes', up, lastUpvote, down, lastDownvote)
            if(!changed){
                //console.log('before')
                if(lastSelected === null || lastUpvote === null || lastDownvote === null){
                    console.log('hello',up,down,selected)
                    setLastSelected(selected)
                    setLastUpvote(up)
                    setLastDownvote(down)
                }
                return  
            } 
            if((lastSelected!==null) && (lastSelected[0]===selected[0]) && (lastSelected[1]===selected[1])) return
            const thisObj = {  // builds the object to send over
                upDelta: up-lastUpvote,
                downDelta: down-lastDownvote,
                upvoteSelected: selected[0],
                downvoteSelected: selected[1],
                postid: postid,
                uid: uid,
            }

            // call function to send data to api
            sendData(thisObj).catch(console.error)
        }

        const handleDebounce = setTimeout(dataHelper, debounceTimeout)

        if(lastSelected === null || lastUpvote === null || lastDownvote === null){  // run initially; don't wait 2 seconds
            dataHelper()
        }
        
              
        return () => {
            clearTimeout(handleDebounce)
        }

    }, [selected, debounceTimeout])

    return { last_up: lastUpvote, last_down: lastDownvote }
}
