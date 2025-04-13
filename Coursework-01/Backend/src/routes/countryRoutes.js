const express = require('express');
const CountryController = require('../controllers/CountryController');
const ApiKeyMiddleware = require('../middleware/ApikeyMiddleware');

const router = express.Router();

router.get('/', ApiKeyMiddleware.validateApiKey, CountryController.getCountries);  //all countries route
router.get('/:name', ApiKeyMiddleware.validateApiKey, CountryController.getCountryByName); //single country route



module.exports = router;