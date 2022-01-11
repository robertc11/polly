// This file handles all the calls to the Google Civic API

const baseURL = 'https://www.googleapis.com/civicinfo/v2'
const key = 'AIzaSyBPyTRO8tcnYubJZiEnyZOCgmIoxPuFNYo'

export async function getPoliticians(){
    var url = baseURL+'/elections?'+'key='+key
    const res = await fetch(url)
    const data = await res.json()

    if(!data){
        return {
            notFound: true,
        }
    }

    return data
}