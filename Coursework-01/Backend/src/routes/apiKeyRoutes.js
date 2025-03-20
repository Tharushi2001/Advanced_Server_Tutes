const express = require('express');
const ApiKeyMiddleware = require('../middleware/ApikeyMiddleware');
const ApiKeyController = require('../controllers/ApiKeyController');

const router = express.Router();

// Protect these routes with authentication middleware


// Generate API key (No authentication, only API key validation needed)
router.post('/generate', ApiKeyController.generateApiKey); 

router.get('/getkey',ApiKeyMiddleware.validateApiKey, ApiKeyController.getApiKey);



// Revoke API key (Requires valid API key)
router.delete('/:id', ApiKeyMiddleware.validateApiKey, ApiKeyController.revokeApiKey);

// Update API key (Requires valid API key)
router.put('/:id', ApiKeyMiddleware.validateApiKey, ApiKeyController.updateApiKey);

module.exports = router;
