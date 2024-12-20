import api from './index';

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: (token) => api.post('/auth/refresh', { token }),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
  updateProfile: (data) => api.put('/auth/profile', data),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  enable2FA: () => api.post('/auth/2fa/enable'),
  verify2FA: (code) => api.post('/auth/2fa/verify', { code }),
  disable2FA: () => api.post('/auth/2fa/disable'),
};
