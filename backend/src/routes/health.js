const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const logger = require('../utils/logger');

// Health check endpoint - no authentication required
router.get('/', async (req, res) => {
    try {
        // Test database connection
        await sequelize.authenticate();

        // Get system status
        const status = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
            uptime: process.uptime(),
            memory: process.memoryUsage()
        };

        logger.info('Health check successful', status);
        res.status(200).json(status);
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

module.exports = router;
