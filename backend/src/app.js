const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const logger = require('./utils/logger');
const { sequelize } = require('./models');
const { auth } = require('./middleware/auth');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Debug middleware
app.use((req, res, next) => {
    logger.info(`[DEBUG] Request: ${req.method} ${req.originalUrl} (path: ${req.path})`);
    next();
});

// Health check endpoint (no auth required)
app.get('/api/health', async (req, res) => {
    logger.info('[DEBUG] Health check endpoint hit');
    try {
        await sequelize.authenticate();
        res.json({ 
            status: 'healthy',
            database: 'connected'
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'unhealthy',
            error: error.message 
        });
    }
});

// Auth routes (no auth required)
app.use('/api/auth', require('./routes/auth'));

// Apply auth middleware to all routes except health check and auth
app.use(auth);

// Protected routes
app.use('/api/users', require('./routes/users'));
app.use('/api/markets', require('./routes/markets'));
app.use('/api/signals', require('./routes/signals'));
app.use('/api/trades', require('./routes/trades'));
app.use('/api/education', require('./routes/education'));
app.use('/api/market-data', require('./routes/marketData'));

// Error handling
app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
