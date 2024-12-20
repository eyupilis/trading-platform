const express = require('express');
const router = express.Router();
const traderRoutes = require('./trader');
const mobileRoutes = require('./mobile');
const logger = require('../utils/logger');

// Log registered routes
const logRoutes = (prefix, routes) => {
    routes.stack.forEach(route => {
        if (route.route) {
            logger.info(`[ROUTES] Registering ${prefix} route: ${route.route.path}`, {
                service: 'trading-platform'
            });
        }
    });
};

// Trader routes
router.use('/trader', traderRoutes);
logRoutes('/trader', traderRoutes);

// Mobile routes
router.use('/mobile', mobileRoutes);
logRoutes('/mobile', mobileRoutes);

module.exports = router;
