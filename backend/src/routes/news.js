const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const db = require('../config/database');

// Get all news
router.get('/', async (req, res) => {
    try {
        const [news] = await db.query(
            `SELECT * FROM news
             ORDER BY published_at DESC
             LIMIT 50`
        );
        
        res.json({ success: true, news });
    } catch (error) {
        logger.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Get news by category
router.get('/category/:category', async (req, res) => {
    try {
        const [news] = await db.query(
            `SELECT * FROM news
             WHERE category = ?
             ORDER BY published_at DESC
             LIMIT 20`,
            [req.params.category]
        );
        
        res.json({ success: true, news });
    } catch (error) {
        logger.error('Error fetching news by category:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Get news categories
router.get('/categories', async (req, res) => {
    try {
        const [categories] = await db.query(
            `SELECT DISTINCT category
             FROM news
             ORDER BY category`
        );
        
        res.json({ success: true, categories });
    } catch (error) {
        logger.error('Error fetching news categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

module.exports = router;
