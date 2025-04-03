const express = require('express');
const ApiKeyMiddleware = require('../middleware/ApikeyMiddleware');
const ApiKeyController = require('../controllers/ApiKeyController');

const router = express.Router();




// Generate API key 
router.post('/generate', ApiKeyController.generateApiKey); 

router.get('/getkey',ApiKeyMiddleware.validateApiKey, ApiKeyController.getApiKey);

// In the router definition
router.put('/update/:id', ApiKeyMiddleware.validateApiKey, (req, res, next) => {
    console.log('PUT /update/:id called');  // This will log when the route is accessed
    next();  // This ensures the request moves to the next middleware/controller
}, ApiKeyController.updateApiKey);





// Revoke API key (Requires valid API key)
router.delete('/:id', ApiKeyMiddleware.validateApiKey, ApiKeyController.revokeApiKey);

// Update API key (Requires valid API key)
router.put('/:id', ApiKeyMiddleware.validateApiKey, ApiKeyController.updateApiKey);

module.exports = router;
