
export function unixToReg(unix){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    //var den = ['AM', 'PM']

    var thisDate = new Date(unix*1000)
    var year = thisDate.getFullYear()
    var month = months[thisDate.getMonth()]
    var date = thisDate.getDate()
    var hour = thisDate.getHours()
    var den = (hour >= 12)?'PM':'AM'
    if(hour % 12 === 0){
        hour = 12
    }else{
        hour = hour % 12
    }
    var min = thisDate.getMinutes()
    if(min < 10){
        min = '0'+min
    }

    var format = month+" "+date+", "+year+" "+hour+":"+min+" "+den
    return format
}

export function getCurrentUnix(){
    return parseInt(Date.now()/1000)
}

export function timeAgo(originalTime){
    // return "hours ago, minutes ago, months ago, or years ago"
    const difference = getCurrentUnix() - originalTime
    if(difference >= 31556926){
        // greater than a year
        return Math.round(difference/31556926)+"y"
    }else if(difference >= 2629743){
        // greater than a month but less than a year
        return Math.round(difference/2629743)+"mo"
    }else if(difference >= 604800){
        return Math.round(difference/604800)+"w"
    }else if(difference >= 86400){
        return Math.round(difference/86400)+"d"
    }else if(difference >= 3600){
        return Math.round(difference/3600)+"h"
    }else if(difference >= 60){
        return Math.round(difference/60)+"m"
    }else{
        return Math.round(difference)+"s"
    }
}