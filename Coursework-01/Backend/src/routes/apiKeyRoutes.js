const express = require('express');
const ApiKeyMiddleware = require('../middleware/ApikeyMiddleware');
const ApiKeyController = require('../controllers/ApiKeyController');

const router = express.Router();


// Generate API key 
router.post('/generate', ApiKeyController.generateApiKey); 

router.get('/getkey',ApiKeyMiddleware.validateApiKey, ApiKeyController.getApiKey);

// Update API key (Requires valid API key)
router.put('/update/:id', ApiKeyMiddleware.validateApiKey, ApiKeyController.updateApiKey);

router.delete('/delete/:id', ApiKeyMiddleware.validateApiKey, ApiKeyController.deleteApiKey);



module.exports = router;
