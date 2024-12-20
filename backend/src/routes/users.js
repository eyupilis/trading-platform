const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { auth, isAdmin } = require('../middleware/auth');

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role = 'user' } = req.body;
        
        // Email kontrolü
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        // Şifre hashleme
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Kullanıcı oluşturma
        const [result] = await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role]
        );
        
        res.json({ success: true, userId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Kullanıcı kontrolü
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Şifre kontrolü
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // JWT token oluşturma
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get all users (admin only)
router.get('/', isAdmin, async (req, res) => {
    try {
        const [users] = await db.query(
            `SELECT u.user_id, u.username, u.email, u.role, u.status,
             COUNT(DISTINCT t.trade_id) as total_trades,
             COUNT(DISTINCT s.signal_id) as total_signals,
             AVG(t.pnl) as average_pnl
             FROM users u
             LEFT JOIN trades t ON u.user_id = t.user_id
             LEFT JOIN signals s ON u.user_id = s.trader_id
             GROUP BY u.user_id`
        );
        
        res.json({ success: true, users });
    } catch (error) {
        logger.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const [user] = await db.query(
            `SELECT u.user_id, u.username, u.email, u.role, u.status,
             COUNT(DISTINCT t.trade_id) as total_trades,
             COUNT(DISTINCT s.signal_id) as total_signals,
             AVG(t.pnl) as average_pnl
             FROM users u
             LEFT JOIN trades t ON u.user_id = t.user_id
             LEFT JOIN signals s ON u.user_id = s.trader_id
             WHERE u.user_id = ?
             GROUP BY u.user_id`,
            [req.user.userId]
        );

        if (!user.length) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, profile: user[0] });
    } catch (error) {
        logger.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // If password is being updated, hash it first
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await db.query(
                'UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?',
                [username, email, hashedPassword, req.user.userId]
            );
        } else {
            await db.query(
                'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
                [username, email, req.user.userId]
            );
        }

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        logger.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

// Get user's trading statistics
router.get('/stats', auth, async (req, res) => {
    try {
        const [stats] = await db.query(
            `SELECT 
                COUNT(DISTINCT t.trade_id) as total_trades,
                SUM(CASE WHEN t.pnl > 0 THEN 1 ELSE 0 END) as winning_trades,
                SUM(CASE WHEN t.pnl < 0 THEN 1 ELSE 0 END) as losing_trades,
                AVG(t.pnl) as average_pnl,
                SUM(t.pnl) as total_pnl,
                COUNT(DISTINCT s.signal_id) as total_signals
             FROM users u
             LEFT JOIN trades t ON u.user_id = t.user_id
             LEFT JOIN signals s ON u.user_id = s.trader_id
             WHERE u.user_id = ?
             GROUP BY u.user_id`,
            [req.user.userId]
        );

        if (!stats.length) {
            return res.status(404).json({ error: 'User stats not found' });
        }

        res.json({ success: true, stats: stats[0] });
    } catch (error) {
        logger.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

// Update user role (admin only)
router.put('/:id/role', isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        await db.query(
            'UPDATE users SET role = ? WHERE user_id = ?',
            [role, id]
        );

        res.json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
        logger.error('Error updating user role:', error);
        res.status(500).json({ error: 'Failed to update user role' });
    }
});

// Disable/Enable user (admin only)
router.put('/:id/status', isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        await db.query(
            'UPDATE users SET status = ? WHERE user_id = ?',
            [status, id]
        );

        res.json({ success: true, message: 'User status updated successfully' });
    } catch (error) {
        logger.error('Error updating user status:', error);
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

// Trader listesi
router.get('/traders', auth, async (req, res) => {
    try {
        const [traders] = await db.query(
            `SELECT u.user_id, u.username, u.email, u.role,
             COUNT(DISTINCT s.signal_id) as total_signals,
             AVG(t.pnl) as average_pnl
             FROM users u
             LEFT JOIN trades t ON u.user_id = t.user_id
             LEFT JOIN signals s ON u.user_id = s.trader_id
             WHERE u.role = 'trader'
             GROUP BY u.user_id`
        );
        res.json({ success: true, traders });
    } catch (error) {
        logger.error('Error fetching traders:', error);
        res.status(500).json({ error: 'Failed to fetch traders' });
    }
});

module.exports = router;
