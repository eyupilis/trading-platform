const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const db = require('../config/database');

// Get user settings
router.get('/', async (req, res) => {
    try {
        const [settings] = await db.query(
            `SELECT * FROM user_settings
             WHERE user_id = ?`,
            [req.user.id]
        );

        if (!settings.length) {
            // Create default settings if not exists
            const defaultSettings = {
                theme: 'light',
                notifications_enabled: true,
                email_notifications: true,
                push_notifications: true,
                language: 'en'
            };

            await db.query(
                `INSERT INTO user_settings (user_id, theme, notifications_enabled, 
                    email_notifications, push_notifications, language)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [req.user.id, defaultSettings.theme, defaultSettings.notifications_enabled,
                 defaultSettings.email_notifications, defaultSettings.push_notifications,
                 defaultSettings.language]
            );

            return res.json({ success: true, settings: defaultSettings });
        }

        res.json({ success: true, settings: settings[0] });
    } catch (error) {
        logger.error('Error fetching user settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update user settings
router.put('/', async (req, res) => {
    try {
        const { theme, notifications_enabled, email_notifications,
                push_notifications, language } = req.body;

        await db.query(
            `UPDATE user_settings 
             SET theme = ?, notifications_enabled = ?,
                 email_notifications = ?, push_notifications = ?,
                 language = ?
             WHERE user_id = ?`,
            [theme, notifications_enabled, email_notifications,
             push_notifications, language, req.user.id]
        );

        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        logger.error('Error updating user settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

// Get notification preferences
router.get('/notifications', async (req, res) => {
    try {
        const [preferences] = await db.query(
            `SELECT * FROM notification_preferences
             WHERE user_id = ?`,
            [req.user.id]
        );

        if (!preferences.length) {
            // Create default preferences if not exists
            const defaultPreferences = {
                new_signal_alert: true,
                price_alert: true,
                trade_execution: true,
                news_alert: true,
                performance_update: true
            };

            await db.query(
                `INSERT INTO notification_preferences 
                    (user_id, new_signal_alert, price_alert, trade_execution,
                     news_alert, performance_update)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [req.user.id, defaultPreferences.new_signal_alert,
                 defaultPreferences.price_alert, defaultPreferences.trade_execution,
                 defaultPreferences.news_alert, defaultPreferences.performance_update]
            );

            return res.json({ success: true, preferences: defaultPreferences });
        }

        res.json({ success: true, preferences: preferences[0] });
    } catch (error) {
        logger.error('Error fetching notification preferences:', error);
        res.status(500).json({ error: 'Failed to fetch notification preferences' });
    }
});

// Update notification preferences
router.put('/notifications', async (req, res) => {
    try {
        const { new_signal_alert, price_alert, trade_execution,
                news_alert, performance_update } = req.body;

        await db.query(
            `UPDATE notification_preferences 
             SET new_signal_alert = ?, price_alert = ?,
                 trade_execution = ?, news_alert = ?,
                 performance_update = ?
             WHERE user_id = ?`,
            [new_signal_alert, price_alert, trade_execution,
             news_alert, performance_update, req.user.id]
        );

        res.json({ success: true, message: 'Notification preferences updated successfully' });
    } catch (error) {
        logger.error('Error updating notification preferences:', error);
        res.status(500).json({ error: 'Failed to update notification preferences' });
    }
});

module.exports = router;
