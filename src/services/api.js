import axios from 'axios';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

let backendUrl = import.meta.env.VITE_API_URL || '';

// Si la URL viene de Render (antiguo servidor suspendido) o está vacía, apuntar a Vercel
if (!backendUrl || backendUrl.includes('onrender.com') || !backendUrl.startsWith('http')) {
  backendUrl = isLocal ? 'http://127.0.0.1:8000' : 'https://pukamisti-backend.vercel.app';
}

// Corrección automática en caso de typos
if (backendUrl.includes('pukamiski-backend.vercel.app')) {
  backendUrl = backendUrl.replace('pukamiski-backend', 'pukamisti-backend');
}

backendUrl = backendUrl.replace(/\/+$/, '');

const api = axios.create({
  baseURL: backendUrl,
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
