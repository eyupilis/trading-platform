const db = require('../config/database');
const logger = require('../utils/logger');

class Signal {
    static async findAll() {
        try {
            const [signals] = await db.query(
                `SELECT s.*, u.username as trader_name 
                 FROM signals s 
                 JOIN users u ON s.trader_id = u.user_id 
                 ORDER BY s.created_at DESC`
            );
            return signals;
        } catch (error) {
            logger.error('Error in Signal.findAll:', error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const [signals] = await db.query(
                `SELECT s.*, u.username as trader_name 
                 FROM signals s 
                 JOIN users u ON s.trader_id = u.user_id 
                 WHERE s.signal_id = ?`,
                [id]
            );
            return signals[0];
        } catch (error) {
            logger.error('Error in Signal.findById:', error);
            throw error;
        }
    }

    static async findByMarket(marketId) {
        try {
            const [signals] = await db.query(
                `SELECT s.*, u.username as trader_name 
                 FROM signals s 
                 JOIN users u ON s.trader_id = u.user_id 
                 WHERE s.market_id = ? 
                 ORDER BY s.created_at DESC`,
                [marketId]
            );
            return signals;
        } catch (error) {
            logger.error('Error in Signal.findByMarket:', error);
            throw error;
        }
    }
}

module.exports = Signal;
