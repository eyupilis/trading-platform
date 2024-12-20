const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Market = require('../models/Market');
const logger = require('../utils/logger');

// Get all markets
router.get('/', auth, async (req, res) => {
    try {
        const markets = await Market.findAll();
        res.json(markets);
    } catch (error) {
        logger.error('Error fetching markets:', error);
        res.status(500).json({ message: 'Error loading markets' });
    }
});

// Get market by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const market = await Market.findById(req.params.id);
        if (!market) {
            return res.status(404).json({ message: 'Market not found' });
        }
        res.json(market);
    } catch (error) {
        logger.error('Error fetching market:', error);
        res.status(500).json({ message: 'Error loading market' });
    }
});

// Create new market
router.post('/', auth, async (req, res) => {
    try {
        const market = await Market.create(req.body);
        res.status(201).json(market);
    } catch (error) {
        logger.error('Error creating market:', error);
        res.status(500).json({ message: 'Error creating market' });
    }
});

// Update market
router.put('/:id', auth, async (req, res) => {
    try {
        const market = await Market.update(req.params.id, req.body);
        if (!market) {
            return res.status(404).json({ message: 'Market not found' });
        }
        res.json(market);
    } catch (error) {
        logger.error('Error updating market:', error);
        res.status(500).json({ message: 'Error updating market' });
    }
});

// Delete market
router.delete('/:id', auth, async (req, res) => {
    try {
        await Market.delete(req.params.id);
        res.status(204).send();
    } catch (error) {
        logger.error('Error deleting market:', error);
        res.status(500).json({ message: 'Error deleting market' });
    }
});

// Get market stats
router.get('/:id/stats', auth, async (req, res) => {
    try {
        const stats = await Market.getMarketStats(req.params.id);
        res.json(stats);
    } catch (error) {
        logger.error('Error fetching market stats:', error);
        res.status(500).json({ message: 'Error loading market stats' });
    }
});

// Search markets
router.get('/search/:query', auth, async (req, res) => {
    try {
        const markets = await Market.search(req.params.query);
        res.json(markets);
    } catch (error) {
        logger.error('Error searching markets:', error);
        res.status(500).json({ message: 'Error searching markets' });
    }
});

module.exports = router;
