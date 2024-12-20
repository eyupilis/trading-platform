import axios from 'axios';
import { store } from '../../store';
import { API_URL } from '../../config';
import { captureError } from '../errorTracking';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { auth } = store.getState();
    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  (error) => {
    captureError(error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 429) {
      // Rate limit exceeded
      return handleRateLimitError(error);
    }
    captureError(error);
    return Promise.reject(error);
  }
);

const handleRateLimitError = (error) => {
  const retryAfter = error.response.headers['retry-after'] || 60;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(api(error.config));
    }, retryAfter * 1000);
  });
};

export default api;
