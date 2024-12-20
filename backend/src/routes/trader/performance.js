const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const db = require('../../config/database');
const { isTrader } = require('../../middleware/auth');

// Get overall performance
router.get('/', isTrader, async (req, res) => {
    try {
        const trader_id = req.user.id;
        
        const [performance] = await db.query(
            `SELECT 
                COUNT(*) as total_signals,
                COUNT(DISTINCT t.id) as total_trades,
                AVG(t.pnl) as average_pnl,
                SUM(CASE WHEN t.pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
                SUM(CASE WHEN t.pnl < 0 THEN 1 ELSE 0 END) as losing_trades,
                MAX(t.pnl) as best_trade,
                MIN(t.pnl) as worst_trade
             FROM signals s
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE s.trader_id = ?
             GROUP BY s.trader_id`,
            [trader_id]
        );

        // Get performance by market
        const [marketPerformance] = await db.query(
            `SELECT 
                m.symbol,
                m.name as market_name,
                COUNT(*) as total_signals,
                COUNT(DISTINCT t.id) as total_trades,
                AVG(t.pnl) as average_pnl,
                SUM(CASE WHEN t.pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
                SUM(CASE WHEN t.pnl < 0 THEN 1 ELSE 0 END) as losing_trades
             FROM signals s
             LEFT JOIN markets m ON s.market_id = m.id
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE s.trader_id = ?
             GROUP BY m.id
             ORDER BY average_pnl DESC`,
            [trader_id]
        );

        // Get monthly performance
        const [monthlyPerformance] = await db.query(
            `SELECT 
                DATE_FORMAT(s.created_at, '%Y-%m') as month,
                COUNT(*) as total_signals,
                COUNT(DISTINCT t.id) as total_trades,
                AVG(t.pnl) as average_pnl,
                SUM(CASE WHEN t.pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
                SUM(CASE WHEN t.pnl < 0 THEN 1 ELSE 0 END) as losing_trades
             FROM signals s
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE s.trader_id = ?
             GROUP BY month
             ORDER BY month DESC`,
            [trader_id]
        );

        res.json({
            success: true,
            performance: performance[0] || {},
            marketPerformance,
            monthlyPerformance
        });
    } catch (error) {
        logger.error('Error fetching trader performance:', error);
        res.status(500).json({ error: 'Failed to fetch performance' });
    }
});

// Get performance by date range
router.get('/range', isTrader, async (req, res) => {
    try {
        const trader_id = req.user.id;
        const { start_date, end_date } = req.query;
        
        const [performance] = await db.query(
            `SELECT 
                COUNT(*) as total_signals,
                COUNT(DISTINCT t.id) as total_trades,
                AVG(t.pnl) as average_pnl,
                SUM(CASE WHEN t.pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
                SUM(CASE WHEN t.pnl < 0 THEN 1 ELSE 0 END) as losing_trades
             FROM signals s
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE s.trader_id = ?
             AND s.created_at BETWEEN ? AND ?
             GROUP BY s.trader_id`,
            [trader_id, start_date, end_date]
        );

        res.json({
            success: true,
            performance: performance[0] || {}
        });
    } catch (error) {
        logger.error('Error fetching trader performance by date range:', error);
        res.status(500).json({ error: 'Failed to fetch performance' });
    }
});

// Get performance by market
router.get('/market/:market_id', isTrader, async (req, res) => {
    try {
        const trader_id = req.user.id;
        const market_id = req.params.market_id;
        
        const [performance] = await db.query(
            `SELECT 
                m.symbol,
                m.name as market_name,
                COUNT(*) as total_signals,
                COUNT(DISTINCT t.id) as total_trades,
                AVG(t.pnl) as average_pnl,
                SUM(CASE WHEN t.pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
                SUM(CASE WHEN t.pnl < 0 THEN 1 ELSE 0 END) as losing_trades
             FROM signals s
             LEFT JOIN markets m ON s.market_id = m.id
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE s.trader_id = ? AND s.market_id = ?
             GROUP BY m.id`,
            [trader_id, market_id]
        );

        if (!performance.length) {
            return res.status(404).json({ error: 'No performance data found for this market' });
        }

        res.json({
            success: true,
            performance: performance[0]
        });
    } catch (error) {
        logger.error('Error fetching trader performance by market:', error);
        res.status(500).json({ error: 'Failed to fetch performance' });
    }
});

module.exports = router;
