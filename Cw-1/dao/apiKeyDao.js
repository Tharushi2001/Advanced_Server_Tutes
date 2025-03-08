const db = require('../config/db');

const ApiKeyDao = {
    async getApiKeyByUserId(userId) {
        try {
            const query = 'SELECT apiKey FROM users WHERE id = ?';
            const results = await db.query(query, [userId]);
            return results.length ? results[0].apiKey : null;
        } catch (error) {
            throw error;
        }
    },

    async updateApiKey(userId, newApiKey) {
        try {
            const query = 'UPDATE users SET apiKey = ? WHERE id = ?';
            await db.query(query, [newApiKey, userId]);
            return { success: true, message: 'API Key updated' };
        } catch (error) {
            throw error;
        }
    }
};

module.exports = ApiKeyDao;
