import axios from 'axios';

import { refreshToken } from './auth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest.url !== '/api/token/' && // Avoid refreshing on login request
      originalRequest.url !== '/api/token/refresh/' && // Avoid infinite refresh loop
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const newAccessToken = await refreshToken();

      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        } else {
          return error.response;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
