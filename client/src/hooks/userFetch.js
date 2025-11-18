import { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

export default function useFetch(url, opts = {}) {
  const [data, setData] = useState(opts.initial || null);
  const [loading, setLoading] = useState(Boolean(opts.auto ?? true));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!opts.auto) return;
    let mounted = true;
    setLoading(true);
    api.get(url)
      .then(res => { if (mounted) setData(res.data); })
      .catch(err => { if (mounted) setError(err); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [url]);

  return { data, loading, error, setData, setError };
}
