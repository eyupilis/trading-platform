const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const logger = require('../../utils/logger');

// Trader login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get trader by email
        const trader = await User.findByEmail(email);
        if (!trader || trader.role !== 'trader') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const validPassword = await User.comparePassword(password, trader.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if trader is active
        if (trader.status !== 'active') {
            return res.status(401).json({ error: 'Account is deactivated' });
        }

        // Generate token
        const token = jwt.sign(
            { id: trader.id, role: trader.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            trader: {
                id: trader.id,
                username: trader.username,
                email: trader.email,
                role: trader.role
            }
        });
    } catch (error) {
        logger.error('Error logging in trader:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// Get trader profile
router.get('/profile', async (req, res) => {
    try {
        const traderId = req.user.id;
        const trader = await User.findById(traderId);
        
        if (!trader) {
            return res.status(404).json({ error: 'Trader not found' });
        }

        res.json({
            success: true,
            trader: {
                id: trader.id,
                username: trader.username,
                email: trader.email,
                role: trader.role
            }
        });
    } catch (error) {
        logger.error('Error getting trader profile:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

module.exports = router;
