import { useEffect, useState, useContext } from "react";
import { axiosInstance } from "../utills/axios.instance";
import { LoadingContext } from "../state/GlobalContext";

export function useFetchData(endpoint) {  
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const { startLoading, stopLoading } = useContext(LoadingContext);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        startLoading();
        const response = await axiosInstance.get(endpoint, {
          signal: controller.signal,
        });
        setData(response.data);
        stopLoading();
      } catch (error) {        
        setError(error?.message || "failed to fetch data");
        stopLoading();
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [endpoint]);
  return [data, error];
}
