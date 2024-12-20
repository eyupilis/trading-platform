const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// Get all active signals for mobile app
router.get('/', auth, async (req, res) => {
    try {
        const [signals] = await db.query(
            `SELECT s.*, u.username as trader_name, m.symbol, m.name as market_name
             FROM signals s 
             JOIN users u ON s.trader_id = u.id
             JOIN markets m ON s.market_id = m.id
             WHERE s.status = 'ACTIVE'
             ORDER BY s.created_at DESC`
        );
        
        res.json({ success: true, trades: signals });
    } catch (error) {
        logger.error('Error fetching signals:', error);
        res.status(500).json({ error: 'Failed to fetch signals' });
    }
});

// Get signals by market
router.get('/market/:market_id', auth, async (req, res) => {
    try {
        const market_id = req.params.market_id;
        
        const [signals] = await db.query(
            `SELECT s.*, u.username as trader_name, m.symbol, m.name as market_name
             FROM signals s 
             JOIN users u ON s.trader_id = u.id
             JOIN markets m ON s.market_id = m.id
             WHERE s.market_id = ? AND s.status = 'ACTIVE'
             ORDER BY s.created_at DESC`,
            [market_id]
        );
        
        res.json({ success: true, trades: signals });
    } catch (error) {
        logger.error('Error fetching signals by market:', error);
        res.status(500).json({ error: 'Failed to fetch signals' });
    }
});

// Get signals by trader
router.get('/trader/:trader_id', auth, async (req, res) => {
    try {
        const trader_id = req.params.trader_id;
        
        const [signals] = await db.query(
            `SELECT s.*, u.username as trader_name, m.symbol, m.name as market_name
             FROM signals s 
             JOIN users u ON s.trader_id = u.id
             JOIN markets m ON s.market_id = m.id
             WHERE s.trader_id = ? AND s.status = 'ACTIVE'
             ORDER BY s.created_at DESC`,
            [trader_id]
        );
        
        res.json({ success: true, trades: signals });
    } catch (error) {
        logger.error('Error fetching signals by trader:', error);
        res.status(500).json({ error: 'Failed to fetch signals' });
    }
});

// Get specific signal details
router.get('/:id', auth, async (req, res) => {
    try {
        const [signal] = await db.query(
            `SELECT s.*, u.username as trader_name, m.symbol, m.name as market_name
             FROM signals s 
             JOIN users u ON s.trader_id = u.id
             JOIN markets m ON s.market_id = m.id
             WHERE s.id = ?`,
            [req.params.id]
        );

        if (!signal.length) {
            return res.status(404).json({ error: 'Signal not found' });
        }

        res.json({ success: true, trade: signal[0] });
    } catch (error) {
        logger.error('Error fetching signal details:', error);
        res.status(500).json({ error: 'Failed to fetch signal details' });
    }
});

module.exports = router;
