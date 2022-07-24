const STORE_ONE = new Map([
    ['.jpg', 'image/jpeg'],
    ['.png', 'image/png'],
    ['.pdf', 'application/pdf'],
    ['.mov', 'video/quicktime'],
    ['.mp4', 'video/mp4'],
])

export function abbrToFull(abbr){
    try{
        return STORE_ONE.get(abbr)
    }catch(err){
        console.log('> extensions.js:', err)
        return null
    }
}


const STORE_TWO = new Map([
    ['image/jpeg', '.jpg'],
    ['image/png', '.png'],
    ['application/pdf', '.pdf'],
    ['video/quicktime', '.mov'],
    ['video/mp4', '.mp4'],
])
export function fullToAbbr(full){
    try{
        return STORE_TWO.get(full)
    }catch(err){
        console.log('> extensions.js:', err)
    }
}