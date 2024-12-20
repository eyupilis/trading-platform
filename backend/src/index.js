const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const logger = require('./utils/logger');
const db = require('./config/database');
const http = require('http');
const WebSocketServer = require('./websocket');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

const PORT = process.env.PORT || 5001;
const wsPort = process.env.WS_PORT || 5002;

// HTTP Server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer(server);
app.set('wss', wss);

// Test database connection
db.getConnection()
    .then(() => {
        logger.info('Database connection successful');
    })
    .catch((err) => {
        logger.error('Database connection failed:', err);
        process.exit(1);
    });

server.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`WebSocket server is running on port ${wsPort}`);
});
