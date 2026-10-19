import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from './api.js';

const AuthContext = createContext(null);

// status: 'loading' | 'authenticated' | 'anonymous' | 'error'
export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'loading', user: null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading', user: null });
    api
      .getMe(controller.signal)
      .then((data) => setState({ status: 'authenticated', user: data.user }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ status: err.status === 401 ? 'anonymous' : 'error', user: null });
      });
    return () => controller.abort();
  }, [tick]);

  const signIn = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    setState({ status: 'authenticated', user: data.user });
  }, []);

  const signUp = useCallback(async (email, password) => {
    const data = await api.register(email, password);
    setState({ status: 'authenticated', user: data.user });
  }, []);

  const signOut = useCallback(async () => {
    await api.logout();
    setState({ status: 'anonymous', user: null });
  }, []);

  const retry = useCallback(() => setTick((t) => t + 1), []);

  const value = useMemo(
    () => ({ ...state, signIn, signUp, signOut, retry }),
    [state, signIn, signUp, signOut, retry],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
