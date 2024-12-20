import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAT_SETTINGS_KEY = '@chat_settings';

export const chatService = {
  // Room operations
  getRooms: async () => {
    try {
      const response = await api.get('/chat/rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      throw error;
    }
  },

  createRoom: async (roomData) => {
    try {
      const response = await api.post('/chat/rooms', roomData);
      return response.data;
    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  joinRoom: async (roomId) => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/join`);
      return response.data;
    } catch (error) {
      console.error('Error joining chat room:', error);
      throw error;
    }
  },

  leaveRoom: async (roomId) => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/leave`);
      return response.data;
    } catch (error) {
      console.error('Error leaving chat room:', error);
      throw error;
    }
  },

  // Message operations
  getMessages: async (roomId) => {
    try {
      const response = await api.get(`/chat/rooms/${roomId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  sendMessage: async (roomId, message) => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/messages`, message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Chat settings
  getChatSettings: async () => {
    try {
      const settings = await AsyncStorage.getItem(CHAT_SETTINGS_KEY);
      return settings ? JSON.parse(settings) : {
        notifications: true,
        soundEnabled: true,
        username: null,
        theme: 'light',
        fontSize: 'medium',
      };
    } catch (error) {
      console.error('Error getting chat settings:', error);
      throw error;
    }
  },

  updateChatSettings: async (settings) => {
    try {
      await AsyncStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
      return settings;
    } catch (error) {
      console.error('Error updating chat settings:', error);
      throw error;
    }
  },

  // Username operations
  generateUsername: () => {
    const adjectives = ['Hızlı', 'Akıllı', 'Güçlü', 'Cesur', 'Şanslı'];
    const nouns = ['Trader', 'Boğa', 'Ayı', 'Balina', 'Kartal'];
    const number = Math.floor(Math.random() * 1000);
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    
    return `${randomAdjective}${randomNoun}${number}`;
  },

  saveUsername: async (username) => {
    try {
      const settings = await chatService.getChatSettings();
      await chatService.updateChatSettings({ ...settings, username });
      return username;
    } catch (error) {
      console.error('Error saving username:', error);
      throw error;
    }
  },
};

export default chatService;
