 import { apiFetcher } from "./fetch"
 
 export const getCartService = async()=>{
    const response = await apiFetcher.request('/cart')
    return response
  }


  export const addToCartService = async(productId, quantity = 1)=>{

   const response = await apiFetcher.request("/cart/add", {
      method: "POST",
      body: { productId, quantity },
    });
    return response
  }

  export const updateCartItemService = async (productId, quantity)=>{
    const response = await apiFetcher.request("/cart/update", {
      method: "PUT",
      body: { productId, quantity },
    });
    return response
  }

 export const removeFromCartService = async (productId)=>{
    const response =  await apiFetcher.request(`/cart/remove/${productId}`, {
      method: "DELETE",
    });
    return response
  }

 export const  clearCartService = async ()=>{
    const response = await apiFetcher.request(`/cart/clear`, {
      method: "DELETE",
    });
    return response
  }

  // Wishlist APIs - Updated to use fetchWithAuth
  export const getWishlistService = async()=>{
    const response = await apiFetcher.request(`/wishlist`);
    return response
  }

  export const addToWishlistService = async(productId)=>{
    const response = await apiFetcher.request(`/wishlist/add`, {
      method: "POST",
      body: { productId },
    });
    return response
  }

  export const  removeFromWishlistService = async(productId)=>{
    const response = await apiFetcher.request(`/wishlist/remove/${productId}`, {
      method: "DELETE",
    });
    return response
  }

  export const  clearWishlistService = async()=>{
    const response = await apiFetcher.request(`/wishlist/clear`, {
      method: "DELETE",
    });
    return response
  }

    export const  getProducts = async(productUrl)=>{
    const response = await apiFetcher.request(productUrl);
    return response
  }
  export const  getCategories = async(categoryUrl)=>{
    const response = await apiFetcher.request(categoryUrl);
    return response

  }

