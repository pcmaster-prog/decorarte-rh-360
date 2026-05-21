import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach authorization token if present
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('decorarte_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('decorarte_token');
      sessionStorage.removeItem('decorarte_user');
      // Redirect or reload if needed in API mode
      if (import.meta.env.VITE_API_MODE === 'api') {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);
