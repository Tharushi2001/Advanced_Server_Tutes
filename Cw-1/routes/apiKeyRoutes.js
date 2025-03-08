const express = require('express');
const ApiKeyDao = require('../Dao/apiKeyDao');
const jwt = require('jsonwebtoken');

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to Authenticate JWT Token
function authenticateToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// ✅ Retrieve API Key (Protected Route)
router.get('/get-api-key', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const apiKey = await ApiKeyDao.getApiKeyByUserId(userId);

        if (!apiKey) {
            return res.status(404).json({ message: 'API Key not found' });
        }

        return res.json({ apiKey });
    } catch (error) {
        console.error('API Key Retrieval Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// ✅ Regenerate API Key (Protected Route)
router.post('/regenerate-api-key', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Generate new API Key
        const newApiKey = require('crypto').randomBytes(32).toString('hex');

        // Update in database
        await ApiKeyDao.updateApiKey(userId, newApiKey);

        return res.json({ message: 'API Key regenerated successfully', apiKey: newApiKey });
    } catch (error) {
        console.error('API Key Regeneration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
