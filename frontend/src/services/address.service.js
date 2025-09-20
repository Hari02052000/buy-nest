import { apiFetcher } from "./fetch"

export async function getAddress(){
    const response = await apiFetcher.request('/address')
    return response
}

export async function createAddress(reqBody){
    const response = await apiFetcher.request('/address',{
        method : "POST",
        body : reqBody
    })
    return response
}

