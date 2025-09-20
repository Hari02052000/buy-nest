import { apiFetcher } from "./fetch"

export async function getOrdersService(){
    const response = await apiFetcher.request('/order')
    return response
}

export async function createOrder(reqBody){
    const response = await apiFetcher.request('/order',{
        method : "POST",
        body : reqBody
    })
    return response
}

export async function verifyOnlinePayment(paymentId){
    const response = await apiFetcher.request('/order/verify-online-order',{
        method : "POST",
        body : {paymentId}
    })
    return response
}
export async function cancelOrderService(orderId){
    const response = await apiFetcher.request(`/order/cancel-order/${orderId}`,{
        method : "PUT"    
    })
    return response
}
