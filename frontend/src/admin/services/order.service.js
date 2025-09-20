import { axiosInstance } from "../utills/axios.instance";
import { axiosCreateAdminFunction } from "../utills/axios.delete.admin";
import { axiosStartLoadingFunction, axiosStopLoadingFunction } from "../utills/axios.delete.admin";

export const getOrderById = async (orderId) => {
  axiosStartLoadingFunction();
  try {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data
  } catch (error) {
    if (error?.response?.data?.error) setStatus(error.response.data.error);
    else setStatus("something went wrong try again");
  } finally {
    axiosStopLoadingFunction();
  }
};
export const editOrderById = async (orderId,orderStatus,paymentStatus,transactionId) => {
  axiosStartLoadingFunction();
  try {
    const reqBody = {}
    if(orderStatus) reqBody.orderStatus = orderStatus
    if(paymentStatus) reqBody.paymentStatus = paymentStatus
    if(transactionId) reqBody.transactionId = transactionId
    console.log(reqBody);
    const response = await axiosInstance.put(`/order/${orderId}`,reqBody);
    return response.data
  } catch (error) {
    if (error?.response?.data?.error) setStatus(error.response.data.error);
    else setStatus("something went wrong try again");
  } finally {
    axiosStopLoadingFunction();
  }
};
