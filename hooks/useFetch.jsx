import { useState, useCallback } from "react";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (method = "GET", body = null) => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...options.headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const response = await fetch(url, {
          ...options,
          method,
          headers,
          ...(body && { body: JSON.stringify(body) }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  const get = useCallback(() => fetchData("GET"), [fetchData]);
  const post = useCallback((body) => fetchData("POST", body), [fetchData]);
  const put = useCallback((body) => fetchData("PUT", body), [fetchData]);
  const del = useCallback((body) => fetchData("DELETE", body), [fetchData]);

  return { data, loading, error, get, post, put, del };
};

export default useFetch;
