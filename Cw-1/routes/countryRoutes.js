const express = require('express');
const router = express.Router();
const apiKeyAuth = require('../middleware/apiKeyAuth');
const { getCountryDetails } = require('../controllers/countryController');

// Protect the endpoint with API key authentication
router.get("/country", apiKeyAuth, getCountryDetails);

module.exports = router;
