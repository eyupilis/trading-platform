import api from './index';

export const tradingAPI = {
  // Pozisyon işlemleri
  openPosition: (data) => api.post('/trading/positions', data),
  closePosition: (positionId, data) => api.post(`/trading/positions/${positionId}/close`, data),
  updatePosition: (positionId, data) => api.put(`/trading/positions/${positionId}`, data),
  getPositions: (params) => api.get('/trading/positions', { params }),
  getPositionDetail: (positionId) => api.get(`/trading/positions/${positionId}`),
  
  // İşlem geçmişi
  getTradeHistory: (params) => api.get('/trading/history', { params }),
  getPositionHistory: (positionId) => api.get(`/trading/positions/${positionId}/history`),
  
  // İstatistikler
  getTradeStatistics: () => api.get('/trading/statistics'),
  getPerformanceMetrics: (params) => api.get('/trading/performance', { params }),
  
  // Take-profit ve Stop-loss
  setTakeProfit: (positionId, price) => 
    api.post(`/trading/positions/${positionId}/take-profit`, { price }),
  setStopLoss: (positionId, price) => 
    api.post(`/trading/positions/${positionId}/stop-loss`, { price }),
  
  // Bildirim ayarları
  updateNotificationPreferences: (data) => api.put('/trading/notifications/preferences', data),
  getNotificationPreferences: () => api.get('/trading/notifications/preferences'),
  getNotificationHistory: (params) => api.get('/trading/notifications/history', { params }),
  markNotificationAsRead: (notificationId) => 
    api.put(`/trading/notifications/${notificationId}/read`),
};
