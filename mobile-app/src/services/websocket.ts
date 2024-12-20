import { WS_URL } from '../config';

class WebSocketService {
    private static instance: WebSocketService;
    private ws: WebSocket | null = null;
    private eventListeners: { [key: string]: ((data: any) => void)[] } = {};

    private constructor() {
        // Private constructor for singleton pattern
    }

    static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    connect() {
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
            this.ws = new WebSocket(WS_URL);

            this.ws.onopen = () => {
                console.log('WebSocket connected');
            };

            this.ws.onmessage = (event) => {
                try {
                    const { event: eventType, data } = JSON.parse(event.data);
                    this.emit(eventType, data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                // Try to reconnect after 5 seconds
                setTimeout(() => this.connect(), 5000);
            };
        }
    }

    on(event: string, callback: (data: any) => void) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }

    off(event: string, callback: (data: any) => void) {
        if (this.eventListeners[event]) {
            this.eventListeners[event] = this.eventListeners[event].filter(
                (cb) => cb !== callback
            );
        }
    }

    private emit(event: string, data: any) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach((callback) => callback(data));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export default WebSocketService.getInstance();
