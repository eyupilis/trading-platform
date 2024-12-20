import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { store } from '../store';
import {
  setConnected,
  incrementReconnectAttempts,
  resetReconnectAttempts,
} from '../store/reducers/networkSlice';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: this.reconnectDelay,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        store.dispatch(setConnected(true));
        store.dispatch(resetReconnectAttempts());
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        store.dispatch(setConnected(false));
      });

      this.socket.on('connect_error', () => {
        store.dispatch(incrementReconnectAttempts());
      });

      // Event listeners'ları yeniden bağla
      this.listeners.forEach((callback, event) => {
        this.socket.on(event, callback);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      // Event listeners'ları temizle
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();

      this.socket.disconnect();
      this.socket = null;
      store.dispatch(setConnected(false));
    }
  }

  addListener(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
    this.listeners.set(event, callback);
  }

  removeListener(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
    this.listeners.delete(event);
  }
}

// Singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
