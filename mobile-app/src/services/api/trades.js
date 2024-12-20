import api from './index';

export const tradesAPI = {
  // Market işlemleri
  getMarkets: () => api.get('/markets'),
  getMarketDetail: (marketId) => api.get(`/markets/${marketId}`),
  getMarketHistory: (marketId, params) => api.get(`/markets/${marketId}/history`, { params }),
  
  // İşlem emirleri
  createOrder: (data) => api.post('/orders', data),
  cancelOrder: (orderId) => api.delete(`/orders/${orderId}`),
  getOrders: (params) => api.get('/orders', { params }),
  getOrderDetail: (orderId) => api.get(`/orders/${orderId}`),
  
  // Portföy işlemleri
  getPortfolio: () => api.get('/portfolio'),
  getPortfolioHistory: (params) => api.get('/portfolio/history', { params }),
  
  // İşlem geçmişi
  getTradeHistory: (params) => api.get('/trades/history', { params }),
  
  // Alarm işlemleri
  createAlert: (data) => api.post('/alerts', data),
  updateAlert: (alertId, data) => api.put(`/alerts/${alertId}`, data),
  deleteAlert: (alertId) => api.delete(`/alerts/${alertId}`),
  getAlerts: () => api.get('/alerts'),
};
