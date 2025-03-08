const db = require('../config/db');

const UsageDao = {
    async logApiUsage(userId, endpoint) {
        try {
            const query = 'INSERT INTO api_usage (user_id, endpoint) VALUES (?, ?)';
            await db.query(query, [userId, endpoint]);
            return { success: true, message: 'API usage logged' };
        } catch (error) {
            throw error;
        }
    },

    async getUsageByUserId(userId) {
        try {
            const query = 'SELECT * FROM api_usage WHERE user_id = ? ORDER BY timestamp DESC';
            const results = await db.query(query, [userId]);
            return results;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = UsageDao;
