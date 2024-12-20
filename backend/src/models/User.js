const bcrypt = require('bcryptjs');
const db = require('../config/database');

class User {
    static async findByEmail(email) {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return users[0];
    }

    static async findById(id) {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return users[0];
    }

    static async create(userData) {
        const { username, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        return users[0];
    }

    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }

    static async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, userId]
        );
    }

    static async updateProfile(userId, updates) {
        const allowedUpdates = ['theme', 'language', 'notifications_enabled'];
        const updateFields = [];
        const updateValues = [];

        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateFields.push(`${key} = ?`);
                updateValues.push(updates[key]);
            }
        });

        if (updateFields.length === 0) return;

        updateValues.push(userId);
        await db.query(
            `UPDATE user_settings SET ${updateFields.join(', ')} WHERE user_id = ?`,
            updateValues
        );
    }
}

module.exports = User;
