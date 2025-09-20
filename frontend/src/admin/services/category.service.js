import { axiosInstance } from "../utills/axios.instance";
import { axiosStartLoadingFunction, axiosStopLoadingFunction } from "../utills/axios.delete.admin";
export const addCategoryFormSubmit = async (values, { setStatus }) => {
  setStatus("");
  axiosStartLoadingFunction();
  try {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("image", values.image);
    if (values.parentId !== undefined && values.parentId !== null) {
      formData.append("parentId", values.parentId);
    }
    const response = await axiosInstance.post("/category", formData);
    if (response.data?.category) setStatus({ type: "success", message: "category added" });
  } catch (error) {
    if (error?.response?.data?.error) setStatus({ type: "error", message: error.response.data.error });
  } finally {
    axiosStopLoadingFunction();
  }
};
export const editCategoryFormService = async (values,id, { setStatus }) => {
  setStatus("");
  axiosStartLoadingFunction();
  try {    
    const response = await axiosInstance.put(`/category/${id}`, values);
    console.log(response);    
    return response
  } catch (error) {
    console.log(error);
    
    if (error?.response?.data?.error) setStatus({ type: "error", message: error.response.data.error });
  } finally {
    axiosStopLoadingFunction();
  }
};

export const uploadCategoryImage = async(data,categoryId)=>{
  axiosStartLoadingFunction()
  try {
    const response = await axiosInstance.post(`/category/upload-image/${categoryId}`,data,{
        headers : {
       "Content-Type": "multipart/form-data",
      }

    })
    return response.data
  } catch (error) {
    console.log(error);
    
  }finally{
    axiosStopLoadingFunction()
  }
}
