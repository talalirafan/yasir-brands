import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000, // don't let a dead connection spin forever — surface the error state instead
});

api.interceptors.request.use((config) => {
  // Admin panel requests carry the admin session token; customer-site requests
  // use the regular one. Prefer whichever applies so admin API calls don't go
  // out unauthenticated (and silently fail) when only a customer is logged in.
  const isAdminRequest = config.url?.startsWith('/admin') || window.location.pathname.startsWith('/admin');
  const token = isAdminRequest
    ? localStorage.getItem('adminToken') || localStorage.getItem('token')
    : localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
