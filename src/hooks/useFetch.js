// src/hooks/useFetch.js — Generic data fetching hook

import { useState, useEffect, useCallback } from 'react';

/**
 * Generic fetch hook that wraps any async function.
 * @param {function} fetchFn - async function to call
 * @param {Array} deps - dependency array (like useEffect)
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}
