const express = require('express');
const CountryController = require('../controllers/CountryController');
const ApiKeyMiddleware = require('../middleware/ApikeyMiddleware');

const router = express.Router();

router.get('/', ApiKeyMiddleware.validateApiKey, CountryController.getCountries);
router.get('/:name', ApiKeyMiddleware.validateApiKey, CountryController.getCountryByName);



module.exports = router;