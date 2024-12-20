import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
  logout: () => api.post('/auth/logout'),
};

export const tradesAPI = {
  getAll: () => api.get('/trades'),
  getById: (id: number) => api.get(`/trades/${id}`),
  create: (data: any) => api.post('/trades', data),
  update: (id: number, data: any) => api.put(`/trades/${id}`, data),
  delete: (id: number) => api.delete(`/trades/${id}`),
};

export default api;
