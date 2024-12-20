const WebSocket = require('ws');
const logger = require('../utils/logger');

class WebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.clients = new Set();

        this.wss.on('connection', (ws) => {
            logger.info('New client connected');
            this.clients.add(ws);

            ws.on('close', () => {
                logger.info('Client disconnected');
                this.clients.delete(ws);
            });

            ws.on('error', (error) => {
                logger.error('WebSocket error:', error);
            });
        });
    }

    broadcast(event, data) {
        const message = JSON.stringify({ event, data });
        this.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    // Signal events
    emitNewSignal(signal) {
        this.broadcast('new_signal', signal);
    }

    emitSignalUpdate(signal) {
        this.broadcast('signal_update', signal);
    }

    emitSignalDelete(signalId) {
        this.broadcast('signal_delete', { id: signalId });
    }

    // Trade events
    emitNewTrade(trade) {
        this.broadcast('new_trade', trade);
    }

    emitTradeUpdate(trade) {
        this.broadcast('trade_update', trade);
    }

    emitTradeDelete(tradeId) {
        this.broadcast('trade_delete', { id: tradeId });
    }
}

module.exports = WebSocketServer;
