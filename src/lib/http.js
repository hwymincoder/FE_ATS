import axios from 'axios';

import { useAuthStore } from '@/stores/auth-store';

const baseURL = import.meta.env.VITE_API_URL || '/api';
const appBasePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const loginPath = `${appBasePath}/candidate/login`;
const staffLoginPath = `${appBasePath}/login`;
const candidateLoginPath = `${appBasePath}/candidate/login`;
const authPaths = [staffLoginPath, candidateLoginPath];

export const http = axios.create({
  baseURL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined' && !authPaths.includes(window.location.pathname)) {
        window.location.replace(loginPath);
      }
    }

    return Promise.reject(error.response?.data || error.message || error);
  },
);
