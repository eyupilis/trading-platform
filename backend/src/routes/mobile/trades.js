const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const db = require('../../config/database');

// Get all active signals
router.get('/', async (req, res) => {
    try {
        const [signals] = await db.query(
            `SELECT s.*, m.symbol, m.name as market_name, u.username as trader_name
             FROM signals s 
             LEFT JOIN markets m ON s.market_id = m.id
             LEFT JOIN users u ON s.trader_id = u.id
             WHERE s.status = 'ACTIVE'
             ORDER BY s.created_at DESC`
        );
        
        res.json({ success: true, signals });
    } catch (error) {
        logger.error('Error fetching signals:', error);
        res.status(500).json({ error: 'Failed to fetch signals' });
    }
});

module.exports = router;
