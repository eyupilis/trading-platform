import api from './index';

export const chatAPI = {
  // Sohbet odaları
  getRooms: (params) => api.get('/chat/rooms', { params }),
  createRoom: (data) => api.post('/chat/rooms', data),
  joinRoom: (roomId) => api.post(`/chat/rooms/${roomId}/join`),
  leaveRoom: (roomId) => api.post(`/chat/rooms/${roomId}/leave`),
  getRoomDetail: (roomId) => api.get(`/chat/rooms/${roomId}`),
  
  // Mesajlar
  getMessages: (roomId, params) => api.get(`/chat/rooms/${roomId}/messages`, { params }),
  sendMessage: (roomId, data) => api.post(`/chat/rooms/${roomId}/messages`, data),
  deleteMessage: (roomId, messageId) => api.delete(`/chat/rooms/${roomId}/messages/${messageId}`),
  
  // Kullanıcı ayarları
  updateChatSettings: (data) => api.put('/chat/settings', data),
  getChatSettings: () => api.get('/chat/settings'),
  
  // Moderasyon
  reportMessage: (roomId, messageId, reason) => 
    api.post(`/chat/rooms/${roomId}/messages/${messageId}/report`, { reason }),
  muteUser: (roomId, userId, duration) => 
    api.post(`/chat/rooms/${roomId}/mute`, { userId, duration }),
  unmuteUser: (roomId, userId) => 
    api.post(`/chat/rooms/${roomId}/unmute`, { userId }),
};
