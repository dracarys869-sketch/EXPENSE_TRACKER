import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (!error.response) {
    return 'Cannot reach the server. Make sure the backend is running, then try again.';
  }
  if (error.response.status >= 500) {
    return 'The server is unavailable or encountered an error. Check that the backend is running, then try again.';
  }
  return error.response.data?.message || fallbackMessage;
};

// Interceptor to add Authorization Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/welcome') {
        window.location.href = '/welcome';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
