const db = require('../config/database');
const logger = require('../utils/logger');

class Trade {
    static async findAll() {
        try {
            const [trades] = await db.query(
                `SELECT t.*, u.username as trader_name, s.entry_price as signal_entry_price,
                        s.take_profit, s.stop_loss, m.name as market_name 
                 FROM trades t 
                 JOIN users u ON t.trader_id = u.user_id 
                 JOIN signals s ON t.signal_id = s.signal_id
                 JOIN markets m ON s.market_id = m.market_id
                 ORDER BY t.created_at DESC`
            );
            return trades;
        } catch (error) {
            logger.error('Error in Trade.findAll:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [trades] = await db.query(
                `SELECT t.*, u.username as trader_name, s.entry_price as signal_entry_price,
                        s.take_profit, s.stop_loss, m.name as market_name 
                 FROM trades t 
                 JOIN users u ON t.trader_id = u.user_id 
                 JOIN signals s ON t.signal_id = s.signal_id
                 JOIN markets m ON s.market_id = m.market_id
                 WHERE t.trade_id = ?`,
                [id]
            );
            return trades[0];
        } catch (error) {
            logger.error('Error in Trade.findById:', error);
            throw error;
        }
    }

    static async findByMarket(marketId) {
        try {
            const [trades] = await db.query(
                `SELECT t.*, u.username as trader_name, s.entry_price as signal_entry_price,
                        s.take_profit, s.stop_loss, m.name as market_name 
                 FROM trades t 
                 JOIN users u ON t.trader_id = u.user_id 
                 JOIN signals s ON t.signal_id = s.signal_id
                 JOIN markets m ON s.market_id = m.market_id
                 WHERE m.market_id = ?
                 ORDER BY t.created_at DESC`,
                [marketId]
            );
            return trades;
        } catch (error) {
            logger.error('Error in Trade.findByMarket:', error);
            throw error;
        }
    }

    static async findBySignal(signalId) {
        try {
            const [trades] = await db.query(
                `SELECT t.*, u.username as trader_name, s.entry_price as signal_entry_price,
                        s.take_profit, s.stop_loss, m.name as market_name 
                 FROM trades t 
                 JOIN users u ON t.trader_id = u.user_id 
                 JOIN signals s ON t.signal_id = s.signal_id
                 JOIN markets m ON s.market_id = m.market_id
                 WHERE t.signal_id = ?
                 ORDER BY t.created_at DESC`,
                [signalId]
            );
            return trades;
        } catch (error) {
            logger.error('Error in Trade.findBySignal:', error);
            throw error;
        }
    }
}

module.exports = Trade;
