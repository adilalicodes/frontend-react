import { useCallback, useEffect, useState } from 'react';
import { getHealth } from './api.js';

// status: 'loading' | 'connected' | 'unavailable'
export function useApiStatus() {
  const [state, setState] = useState({ status: 'loading', error: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', error: null });
    getHealth(controller.signal)
      .then((data) =>
        setState(
          data?.status === 'ok'
            ? { status: 'connected', error: null }
            : { status: 'unavailable', error: 'Unexpected health response' },
        ),
      )
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'unavailable', error: err.message });
      });
    return () => controller.abort();
  }, [tick]);

  const retry = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, retry };
}
