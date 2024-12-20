import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
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

// Auth related API calls
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/profile')
};

// Trade signals API calls
export const tradesAPI = {
    getAll: () => api.get('/trades'),
    getByMarket: (marketId) => api.get(`/trades/market/${marketId}`),
    getByTrader: (traderId) => api.get(`/trades/trader/${traderId}`),
    getById: (id) => api.get(`/trades/${id}`)
};

// Market data API calls
export const marketAPI = {
    getAll: () => api.get('/markets'),
    getById: (id) => api.get(`/markets/${id}`),
    getPrices: () => api.get('/markets/prices')
};

// News API calls
export const newsAPI = {
    getAll: () => api.get('/news'),
    getByCategory: (category) => api.get(`/news/category/${category}`),
    getCategories: () => api.get('/news/categories')
};

// User profile and settings API calls
export const userAPI = {
    getProfile: () => api.get('/profile'),
    updateProfile: (profileData) => api.put('/profile', profileData),
    changePassword: (passwordData) => api.put('/profile/password', passwordData),
    getFavorites: () => api.get('/profile/favorites'),
    addFavorite: (traderId) => api.post(`/profile/favorites/${traderId}`),
    removeFavorite: (traderId) => api.delete(`/profile/favorites/${traderId}`)
};

// Settings API calls
export const settingsAPI = {
    get: () => api.get('/settings'),
    update: (settingsData) => api.put('/settings', settingsData),
    getNotificationPreferences: () => api.get('/settings/notifications'),
    updateNotificationPreferences: (preferencesData) => api.put('/settings/notifications', preferencesData)
};

export default {
    authAPI,
    tradesAPI,
    marketAPI,
    newsAPI,
    userAPI,
    settingsAPI
};
