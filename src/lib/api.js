const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function request(path, { signal, body, headers, ...options } = {}) {
  if (!BASE_URL) throw new ApiError('VITE_API_BASE_URL is not set');

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      signal,
      credentials: 'include', // send the HttpOnly session cookie
      headers: { ...(body !== undefined && { 'Content-Type': 'application/json' }), ...headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Cannot reach the API');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.error || `Request failed (${res.status})`, res.status);
  }
  return data;
}

export const getHealth = (signal) => request('/health', { signal });

export const getMe = (signal) => request('/api/auth/me', { signal });
export const register = (email, password) =>
  request('/api/auth/register', { method: 'POST', body: { email, password } });
export const login = (email, password) =>
  request('/api/auth/login', { method: 'POST', body: { email, password } });
export const logout = () => request('/api/auth/logout', { method: 'POST', body: {} });
