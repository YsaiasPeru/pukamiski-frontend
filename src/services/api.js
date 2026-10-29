import axios from 'axios';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (isLocal ? 'http://127.0.0.1:8000' : 'https://pukamisti-backend.onrender.com'),
});

// Interceptor para inyectar el token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('puka_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
