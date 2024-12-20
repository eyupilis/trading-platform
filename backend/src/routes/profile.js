const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Get user profile
router.get('/', async (req, res) => {
    try {
        const [user] = await db.query(
            `SELECT id, username, email, full_name, created_at
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, profile: user[0] });
    } catch (error) {
        logger.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile
router.put('/', async (req, res) => {
    try {
        const { username, full_name } = req.body;

        await db.query(
            `UPDATE users 
             SET username = ?, full_name = ?
             WHERE id = ?`,
            [username, full_name, req.user.id]
        );

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        logger.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Change password
router.put('/password', async (req, res) => {
    try {
        const { current_password, new_password } = req.body;

        // Get user's current password
        const [user] = await db.query(
            'SELECT password FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check current password
        const validPassword = await bcrypt.compare(current_password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        // Update password
        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        logger.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Get user's favorite traders
router.get('/favorites', async (req, res) => {
    try {
        const [favorites] = await db.query(
            `SELECT u.id, u.username, u.full_name,
                    COUNT(DISTINCT s.id) as total_signals,
                    AVG(t.pnl) as average_pnl
             FROM user_favorite_traders uft
             JOIN users u ON uft.trader_id = u.id
             LEFT JOIN signals s ON u.id = s.trader_id
             LEFT JOIN trades t ON s.id = t.signal_id
             WHERE uft.user_id = ?
             GROUP BY u.id`,
            [req.user.id]
        );

        res.json({ success: true, favorites });
    } catch (error) {
        logger.error('Error fetching favorite traders:', error);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

// Add trader to favorites
router.post('/favorites/:trader_id', async (req, res) => {
    try {
        const trader_id = req.params.trader_id;

        // Check if trader exists and is actually a trader
        const [trader] = await db.query(
            'SELECT id FROM users WHERE id = ? AND role = "trader"',
            [trader_id]
        );

        if (!trader.length) {
            return res.status(404).json({ error: 'Trader not found' });
        }

        // Add to favorites
        await db.query(
            'INSERT INTO user_favorite_traders (user_id, trader_id) VALUES (?, ?)',
            [req.user.id, trader_id]
        );

        res.json({ success: true, message: 'Trader added to favorites' });
    } catch (error) {
        logger.error('Error adding trader to favorites:', error);
        res.status(500).json({ error: 'Failed to add to favorites' });
    }
});

// Remove trader from favorites
router.delete('/favorites/:trader_id', async (req, res) => {
    try {
        const trader_id = req.params.trader_id;

        await db.query(
            'DELETE FROM user_favorite_traders WHERE user_id = ? AND trader_id = ?',
            [req.user.id, trader_id]
        );

        res.json({ success: true, message: 'Trader removed from favorites' });
    } catch (error) {
        logger.error('Error removing trader from favorites:', error);
        res.status(500).json({ error: 'Failed to remove from favorites' });
    }
});

module.exports = router;
