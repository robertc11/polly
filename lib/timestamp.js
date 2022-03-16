
export function unixToReg(unix){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var den = ['AM', 'PM']

    var thisDate = new Date(unix*1000)
    var year = thisDate.getFullYear()
    var month = months[thisDate.getMonth()]
    var date = thisDate.getDate()
    var hour = thisDate.getHours()
    var min = thisDate.getMinutes()
    if(min < 10){
        min = '0'+min
    }

    var format = month+" "+date+", "+year+" "+(hour % 12)+":"+min+" "+den[Math.floor(hour/12)]
    return format
}

export function getCurrentUnix(){
    return parseInt(Date.now()/1000)
}