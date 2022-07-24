
// returns a 6 digit random number, first digit never 0
export function generateRandDigits(){
    return Math.floor(100000 + Math.random() * 900000)
}