const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/countries', async (req, res) => {
    try {
        const response = await axios.get(process.env.RESTCOUNTRIES_API_URL || 'https://restcountries.com/v3.1/all?fields=name,capital,currencies,languages,flags');
        res.json(response.data);
    } catch (error) {
        console.error('Error retrieving data from RestCountries API:', error.message);
        res.status(error.response?.status || 500).json({
            error: 'Failed to fetch country data',
            message: error.message
        });
    }
});

module.exports = router;
