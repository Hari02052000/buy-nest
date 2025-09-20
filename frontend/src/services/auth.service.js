import { apiFetcher } from "./fetch"

export async function userLoginService(reqBody){
    const response = await apiFetcher.request('/auth/login',{
        method: "POST",
        body : reqBody
    })
    return response
}

export async function registerUserService(reqBody){
    const response = await apiFetcher.request('/auth/register',{
        method : "POST",
        body : reqBody
    })
    return response
}

export async function getCurrentUser(){
    const response = await apiFetcher.request('/user')
    return response
}
export async function logoutUserService(){
    const response = await apiFetcher.request('/user/logout')
    return response
}