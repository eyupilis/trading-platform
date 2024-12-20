const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Market {
    static async findById(id) {
        const [markets] = await db.query('SELECT * FROM markets WHERE id = ?', [id]);
        return markets[0];
    }

    static async findBySymbol(symbol) {
        const [markets] = await db.query('SELECT * FROM markets WHERE symbol = ?', [symbol]);
        return markets[0];
    }

    static async findAll({ offset = 0, limit = 10, orderBy = 'created_at', order = 'DESC' } = {}) {
        const [markets] = await db.query(
            'SELECT * FROM markets ORDER BY ?? ? LIMIT ? OFFSET ?',
            [orderBy, order, limit, offset]
        );
        return markets;
    }

    static async create(marketData) {
        const { 
            symbol, 
            name, 
            type, 
            base_asset, 
            quote_asset,
            min_price,
            max_price,
            tick_size,
            min_qty,
            max_qty,
            step_size,
            status = 'active',
            metadata 
        } = marketData;
        const id = uuidv4();

        await db.query(
            `INSERT INTO markets (
                id, symbol, name, type, base_asset, quote_asset,
                min_price, max_price, tick_size, min_qty, max_qty,
                step_size, status, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id, symbol, name, type, base_asset, quote_asset,
                min_price, max_price, tick_size, min_qty, max_qty,
                step_size, status, JSON.stringify(metadata)
            ]
        );

        const [markets] = await db.query('SELECT * FROM markets WHERE id = ?', [id]);
        return markets[0];
    }

    static async update(id, updates) {
        const allowedUpdates = [
            'name', 'type', 'base_asset', 'quote_asset',
            'min_price', 'max_price', 'tick_size', 'min_qty',
            'max_qty', 'step_size', 'status', 'metadata'
        ];
        const updateFields = [];
        const updateValues = [];

        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                if (key === 'metadata') {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(JSON.stringify(updates[key]));
                } else {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(updates[key]);
                }
            }
        });

        if (updateFields.length > 0) {
            updateValues.push(id);
            await db.query(
                `UPDATE markets SET ${updateFields.join(', ')} WHERE id = ?`,
                updateValues
            );
        }

        const [markets] = await db.query('SELECT * FROM markets WHERE id = ?', [id]);
        return markets[0];
    }

    static async delete(id) {
        await db.query('DELETE FROM markets WHERE id = ?', [id]);
    }

    static async getActiveMarkets() {
        const [markets] = await db.query(
            'SELECT * FROM markets WHERE status = "active" ORDER BY symbol',
            []
        );
        return markets;
    }

    static async search(query, { limit = 10 } = {}) {
        const [markets] = await db.query(
            'SELECT * FROM markets WHERE symbol LIKE ? OR name LIKE ? LIMIT ?',
            [`%${query}%`, `%${query}%`, limit]
        );
        return markets;
    }

    static async getMarketStats(marketId) {
        const [stats] = await db.query(
            `SELECT 
                COUNT(s.id) as total_signals,
                SUM(CASE WHEN s.status = 'closed' AND s.target_price > s.entry_price THEN 1 ELSE 0 END) as profitable_signals,
                AVG(CASE 
                    WHEN s.status = 'closed' AND s.signal_type = 'buy' THEN ((s.target_price - s.entry_price) / s.entry_price) * 100
                    WHEN s.status = 'closed' AND s.signal_type = 'sell' THEN ((s.entry_price - s.target_price) / s.entry_price) * 100
                    ELSE 0 
                END) as avg_profit_percentage
            FROM markets m
            LEFT JOIN signals s ON s.market_id = m.id
            WHERE m.id = ?
            GROUP BY m.id`,
            [marketId]
        );
        return stats[0];
    }
}

module.exports = Market;
