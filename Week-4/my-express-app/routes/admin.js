const express = require('express'); 
const router = express.Router();  // Corrected router initialization
const ApiKey = require('../models/apiKey'); // Import ApiKey model

// Route to create an API key
router.post('/api-keys', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const apiKey = await ApiKey.create(name);
        res.status(201).json({
            message: 'API key created successfully',
            apiKey: apiKey.key
        });
    } catch (error) {
        console.error('Error creating API key:', error);
        res.status(500).json({ error: 'Error creating API key' });
    }
});

module.exports = router;  // Ensure router is exported
