const express = require('express');
const ApiKeyDao = require('../Dao/apiKeyDao');

const router = express.Router();

// Middleware to Authenticate API Key
function authenticateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ message: 'Unauthorized: No API Key provided' });
    }

    ApiKeyDao.getUserByApiKey(apiKey).then(user => {
        if (!user) {
            return res.status(403).json({ message: 'Invalid API Key' });
        }

        req.user = user;
        next();
    }).catch(error => {
        console.error('Error authenticating API Key:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    });
}

// Retrieve API Key (Protected Route)
router.get('/get-api-key', authenticateApiKey, async (req, res) => {
    try {
        const userId = req.user.id;
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

// Regenerate API Key (Protected Route)
router.post('/regenerate-api-key', authenticateApiKey, async (req, res) => {
    try {
        const userId = req.user.id;

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
