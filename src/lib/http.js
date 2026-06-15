import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

const baseURL = import.meta.env.VITE_API_URL || '';

export const http = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  // TODO: bật lại khi BE có AuthController + JWT
  // const token = useAuthStore.getState().token;
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // if (error.response?.status === 401) {
    //   useAuthStore.getState().clearAuth();
    //   if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    //     window.location.href = '/login';
    //   }
    // }
    return Promise.reject(error.response?.data || error.message || error);
  },
);
