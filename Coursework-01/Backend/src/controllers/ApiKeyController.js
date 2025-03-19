const ApiKeyDao = require('../dao/ApiKeyDao');
const crypto = require('crypto');

class ApiKeyController {
  static async generateApiKey(req, res) {
    const userId = req.userId; // Get user ID from the request (set by AuthMiddleware)
    const apiKey = crypto.randomBytes(32).toString('hex');

    try {
      const apiKeyId = await ApiKeyDao.createApiKey(apiKey, userId);
      res.status(201).json({ id: apiKeyId, apiKey });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async listApiKeys(req, res) {
    const userId = req.userId;

    try {
      const apiKeys = await ApiKeyDao.getApiKeysByUserId(userId); // Fixed method name here
      res.json(apiKeys);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async revokeApiKey(req, res) {
    const { id } = req.params;

    try {
      const deletedRows = await ApiKeyDao.deleteApiKey(id);
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'API key not found' });
      }
      res.json({ message: 'API key revoked successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ApiKeyController;
