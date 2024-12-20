const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const db = require('../config/database');
const { isTrader } = require('../middleware/auth');

// Get all signals
router.get('/', async (req, res) => {
    try {
        const [signals] = await db.query(
            `SELECT s.*, u.username as trader_name, 
             COUNT(DISTINCT t.id) as total_trades,
             AVG(t.pnl) as average_pnl
             FROM signals s 
             LEFT JOIN users u ON s.trader_id = u.id
             LEFT JOIN trades t ON s.id = t.signal_id
             GROUP BY s.id
             ORDER BY s.created_at DESC`
        );
        
        res.json({ success: true, signals });
    } catch (error) {
        logger.error('Error fetching signals:', error);
        res.status(500).json({ error: 'Failed to fetch signals' });
    }
});

// Get specific signal
router.get('/:id', async (req, res) => {
    try {
        const [signal] = await db.query(
            `SELECT s.*, u.username as trader_name,
             COUNT(DISTINCT t.id) as total_trades,
             AVG(t.pnl) as average_pnl
             FROM signals s 
             LEFT JOIN users u ON s.trader_id = u.id
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE s.id = ?
             GROUP BY s.id`,
            [req.params.id]
        );

        if (!signal.length) {
            return res.status(404).json({ error: 'Signal not found' });
        }

        res.json({ success: true, signal: signal[0] });
    } catch (error) {
        logger.error('Error fetching signal:', error);
        res.status(500).json({ error: 'Failed to fetch signal' });
    }
});

// Get trader's performance stats
router.get('/trader/:traderId/stats', async (req, res) => {
    try {
        const [stats] = await db.query(
            `SELECT 
                COUNT(*) as total_signals,
                COUNT(DISTINCT t.id) as total_trades,
                AVG(t.pnl) as average_pnl,
                SUM(CASE WHEN t.pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
                SUM(CASE WHEN t.pnl < 0 THEN 1 ELSE 0 END) as losing_trades
             FROM signals s
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE s.trader_id = ?
             GROUP BY s.trader_id`,
            [req.params.traderId]
        );

        if (!stats.length) {
            return res.status(404).json({ error: 'Trader not found or no signals' });
        }

        res.json({ success: true, stats: stats[0] });
    } catch (error) {
        logger.error('Error fetching trader stats:', error);
        res.status(500).json({ error: 'Failed to fetch trader stats' });
    }
});

module.exports = router;
