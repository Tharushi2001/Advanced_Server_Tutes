const express = require('express');
const ApiKeyController = require('../controllers/ApiKeyController');
const AuthMiddleware = require('../middleware/AuthMiddleware'); // Ensure you have this middleware

const router = express.Router();

// Protect these routes with authentication middleware
router.post('/generate', AuthMiddleware.checkAuth, ApiKeyController.generateApiKey); // Generate API key
router.get('/', AuthMiddleware.checkAuth, ApiKeyController.listApiKeys); // List API keys
router.delete('/:id', AuthMiddleware.checkAuth, ApiKeyController.revokeApiKey); // Revoke API key

module.exports = router;