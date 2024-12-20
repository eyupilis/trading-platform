const WebSocket = require('ws');
const logger = require('./utils/logger');

let wss;

function initializeWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        logger.info('New WebSocket connection');

        // Binance WebSocket bağlantısı
        const binanceWs = new WebSocket('wss://data-stream.binance.vision:443/ws/btcusdt@kline_1m');

        binanceWs.on('message', (data) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data);
            }
        });

        ws.on('close', () => {
            logger.info('Client disconnected');
            binanceWs.close();
        });
    });

    return wss;
}

function broadcastToAll(data) {
    if (!wss) return;

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Sinyal güncellemelerini yayınla
function broadcastSignalUpdate(signal) {
    broadcastToAll({
        type: 'signal_update',
        data: signal
    });
}

// Trade güncellemelerini yayınla
function broadcastTradeUpdate(trade) {
    broadcastToAll({
        type: 'trade_update',
        data: trade
    });
}

module.exports = {
    initializeWebSocket,
    broadcastSignalUpdate,
    broadcastTradeUpdate
};
