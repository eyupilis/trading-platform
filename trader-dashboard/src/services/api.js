import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    login: (credentials) => api.post('/trader/auth/login', credentials),
    getProfile: () => api.get('/trader/auth/profile')
};

export const signals = {
    create: (signalData) => api.post('/trader/signals', signalData),
    getAll: () => api.get('/trader/signals'),
    getById: (signalId) => api.get(`/trader/signals/${signalId}`),
    updateStatus: (signalId, status) => api.patch(`/trader/signals/${signalId}/status`, { status })
};

export const performance = {
    getOverall: () => api.get('/trader/performance'),
    getByDateRange: (startDate, endDate) => api.get('/trader/performance/range', { params: { start_date: startDate, end_date: endDate } }),
    getByMarket: (marketId) => api.get(`/trader/performance/market/${marketId}`)
};

export default api;
