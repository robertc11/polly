// This file handles all the calls to the Google Civic API

const baseURL = 'https://www.googleapis.com/civicinfo/v2'
const key = process.env.CIVIC_KEY

// function to handle elections electionQuery
// returns list of available elections to query
export async function getElections(){
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

// function to handle elections voterInfoQuery
// looks up info relevant to a voter based on his/her registered address
// requires param: address - str | optional params: electionId - int, officialOnly - bool
export async function getVoterInfo(address, electionID=null, officialOnly=null){
    var url = baseURL+'/voterinfo?'+'key='+key+'&address='+address

    if(electionID !== null){
        url += '&electionId='+electionID
    }
    if(officialOnly !== null){
        url += '&officialOnly='+officialOnly
    }

    const res = await fetch(url)
    const data = await res.json()

    if(!data){
        return {
            notFound: true,
        }
    }

    return data
}

// function to handle representatives representativeInfoByAddress
// looks up political geography and representative info for an address
// optional params: address - str, includeOffices - bool, levels - str, roles - str 
export async function getRepresentativeByAddress(address=null, includeOffices=null, levels=null, roles=null){
    var url = baseURL+'/representatives?'+'key='+key

    if(address !== null){
        url += '&address='+address
    }
    if(includeOffices !== null){
        url += '&includeOffices='+includeOffices
    }
    if(levels !== null){
        url += '&levels='+levels
    }
    if(roles !== null){
        url += '&roles='+roles
    }

    const res = await fetch(url)
    const data = await res.json()

    if(!data){
        return {
            notFound: true,
        }
    }

    return data
}

//function to handles representatives representativeInfoByDivision
// looks up representative data for a single geographic division
// required params: ocdId- str | optional params: levels - str, recursive - bool, roles - str
export async function getRepresentativeByDivision(ocdId, levels=null, recursive=null, roles=null){
    var url = baseURL+'/representatives/'+ocdId+'?key='+key

    if(levels !== null){
        url += '&levels='+levels
    }
    if(recursive !== null){
        url += '&recursive='+recursive
    }
    if(roles !== null){
        url += '&roles='+roles
    }

    const res = await fetch(url)
    const data = await res.json()

    if(!data){
        return {
            notFound: true,
        }
    }

    return data
}