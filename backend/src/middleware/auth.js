const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Authenticate user
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('Authentication error:', error);
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// Authenticate trader
const isTrader = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'trader') {
            throw new Error();
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('Trader authentication error:', error);
        res.status(401).json({ error: 'Not authorized as trader' });
    }
};

module.exports = {
    auth,
    isTrader
};
