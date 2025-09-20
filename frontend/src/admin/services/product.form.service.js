import { axiosInstance } from "../utills/axios.instance";
import { axiosStartLoadingFunction, axiosStopLoadingFunction } from "../utills/axios.delete.admin";

export const addProductFormSubmit = async (values, { setStatus }) => {
  axiosStartLoadingFunction();
  try {
    const formData = new FormData();
    console.log(values);
    const { name, description, price, categoryPath, brand, model, stock, images } = values;
    const finalCategoryId = categoryPath[values.categoryPath.length - 1]?.id;

    formData.append("name", name);
    formData.append("price", price);
    formData.append("category", finalCategoryId);
    formData.append("brand", brand);
    formData.append("description", description);
    formData.append("model", model);
    formData.append("stock", stock);
    images.forEach((image) => {
      formData.append("images", image);
    });
    const response = await axiosInstance.post("/product", formData);
    if (response.data?.product) setStatus({ type: "success", message: "product added" });
  } catch (error) {
    if (error?.response?.data?.error) setStatus({ type: "error", message: error.response.data.error });
  } finally {
    axiosStopLoadingFunction();
  }
};

export const editProductFormService = async(productId,data)=>{
    const response = await axiosInstance.put(`/product/${productId}`,data)
    return response
  
}
export const uploadImagesService = async(productId,data)=>{  
    const response = await axiosInstance.put(`/product/upload-image/${productId}`,data,{
      headers : {
       "Content-Type": "multipart/form-data",
      }
    })
    return response
  
}
export const deleteProductImage = async(image,productId)=>{
  axiosStartLoadingFunction()
  try {
    const response = await axiosInstance.delete(`/product/delete-image/${productId}`,{
      data : {
        image
      }
    })
    return response
  } catch (error) {
    console.log(error);
    
  }finally{
    axiosStopLoadingFunction()
  }
}
