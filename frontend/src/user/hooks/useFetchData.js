import { useEffect, useState, useContext } from "react";
import { apiFetcher } from "../../services/fetch";

export function useFetchData(endpoint) {
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await apiFetcher.request(endpoint, {
          signal: controller.signal,
        });
        setData(response);
        setLoading(false)
      } catch (error) {        
        if (error.name === "AbortError") return;
        setError(error?.message || "failed to fetch data");
        setLoading(false)
      }
    };
    fetchData();
    return () => {
      controller.abort();
    };
  }, [endpoint]);
  return [data,loading,error];
}
