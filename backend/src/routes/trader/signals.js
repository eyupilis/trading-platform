const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const db = require('../../config/database');
const { isTrader } = require('../../middleware/auth');
const WebSocketServer = require('../../websocket');

// Get trader's signals
router.get('/', isTrader, async (req, res) => {
    try {
        const trader_id = req.user.id;
        
        const [signals] = await db.query(
            `SELECT s.*, m.symbol, m.name as market_name,
             COUNT(DISTINCT t.id) as total_trades,
             AVG(t.pnl) as average_pnl
             FROM signals s 
             LEFT JOIN markets m ON s.market_id = m.id
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE s.trader_id = ?
             GROUP BY s.id
             ORDER BY s.created_at DESC`,
            [trader_id]
        );
        
        res.json({ success: true, signals });
    } catch (error) {
        logger.error('Error fetching trader signals:', error);
        res.status(500).json({ error: 'Failed to fetch signals' });
    }
});

// Create new signal
router.post('/', isTrader, async (req, res) => {
    try {
        const { market_id, entry_price, take_profit, stop_loss, direction, analysis } = req.body;
        const trader_id = req.user.id;

        // Validate input
        if (!market_id || !entry_price || !take_profit || !stop_loss || !direction) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert signal
        const [result] = await db.query(
            `INSERT INTO signals (trader_id, market_id, entry_price, take_profit, stop_loss, direction, analysis)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [trader_id, market_id, entry_price, take_profit, stop_loss, direction, analysis]
        );

        // Get created signal
        const [signal] = await db.query(
            `SELECT s.*, m.symbol, m.name as market_name
             FROM signals s 
             LEFT JOIN markets m ON s.market_id = m.id
             WHERE s.id = ?`,
            [result.insertId]
        );

        // WebSocket üzerinden yeni sinyali yayınla
        req.app.get('wss').emitNewSignal(signal[0]);

        res.json({ success: true, signal: signal[0] });
    } catch (error) {
        logger.error('Error creating signal:', error);
        res.status(500).json({ error: 'Failed to create signal' });
    }
});

// Update signal
router.put('/:id', isTrader, async (req, res) => {
    try {
        const { id } = req.params;
        const { take_profit, stop_loss, analysis } = req.body;
        const trader_id = req.user.id;

        // Check if signal exists and belongs to trader
        const [signals] = await db.query(
            'SELECT * FROM signals WHERE id = ? AND trader_id = ?',
            [id, trader_id]
        );

        if (signals.length === 0) {
            return res.status(404).json({ error: 'Signal not found' });
        }

        // Update signal
        await db.query(
            `UPDATE signals 
             SET take_profit = ?, stop_loss = ?, analysis = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [take_profit, stop_loss, analysis, id]
        );

        // Get updated signal with market info
        const [updatedSignals] = await db.query(
            `SELECT s.*, m.symbol, m.name as market_name
             FROM signals s 
             LEFT JOIN markets m ON s.market_id = m.id
             WHERE s.id = ?`,
            [id]
        );

        const signal = updatedSignals[0];

        // WebSocket üzerinden sinyal güncellemesini yayınla
        req.app.get('wss').emitSignalUpdate(signal);

        res.json({ success: true, signal });
    } catch (error) {
        logger.error('Error updating signal:', error);
        res.status(500).json({ error: 'Failed to update signal' });
    }
});

// Update signal status
router.patch('/:id/status', isTrader, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const trader_id = req.user.id;

        // Update signal
        await db.query(
            'UPDATE signals SET status = ? WHERE id = ? AND trader_id = ?',
            [status, id, trader_id]
        );

        // Get updated signal
        const [signal] = await db.query(
            `SELECT s.*, m.symbol, m.name as market_name
             FROM signals s 
             LEFT JOIN markets m ON s.market_id = m.id
             WHERE s.id = ?`,
            [id]
        );

        // WebSocket üzerinden sinyal güncellemesini yayınla
        req.app.get('wss').emitSignalUpdate(signal[0]);

        res.json({ success: true, signal: signal[0] });
    } catch (error) {
        logger.error('Error updating signal status:', error);
        res.status(500).json({ error: 'Failed to update signal status' });
    }
});

// Delete signal
router.delete('/:id', isTrader, async (req, res) => {
    try {
        const { id } = req.params;
        const trader_id = req.user.id;

        // Delete signal
        await db.query(
            'DELETE FROM signals WHERE id = ? AND trader_id = ?',
            [id, trader_id]
        );

        // WebSocket üzerinden sinyal silme bilgisini yayınla
        req.app.get('wss').emitSignalDelete(id);

        res.json({ success: true });
    } catch (error) {
        logger.error('Error deleting signal:', error);
        res.status(500).json({ error: 'Failed to delete signal' });
    }
});

// Get trader performance
router.get('/performance', isTrader, async (req, res) => {
    try {
        const trader_id = req.user.id;
        
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
             GROUP BY s.trader_id`,
            [trader_id]
        );

        res.json({ success: true, performance: performance[0] });
    } catch (error) {
        logger.error('Error fetching trader performance:', error);
        res.status(500).json({ error: 'Failed to fetch performance' });
    }
});

module.exports = router;
