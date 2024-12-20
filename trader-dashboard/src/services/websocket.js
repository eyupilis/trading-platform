class WebSocketService {
    constructor() {
        this.ws = null;
        this.maxReconnectAttempts = 5;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
    }

    connect() {
        if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
            this.ws = new WebSocket('ws://localhost:5002');

            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
            };

            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    setTimeout(() => this.connect(), this.reconnectDelay);
                }
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    // Yeni sinyal oluşturulduğunda
    emitNewSignal(signal) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                event: 'new_signal',
                data: signal
            }));
        }
    }

    // Sinyal güncellendiğinde
    emitSignalUpdate(signal) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                event: 'signal_update',
                data: signal
            }));
        }
    }

    // Sinyal silindiğinde
    emitSignalDelete(signalId) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                event: 'signal_delete',
                data: { id: signalId }
            }));
        }
    }
}

// Singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
