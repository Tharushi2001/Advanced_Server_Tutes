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
 
  // In ApiKeyController.js
  static async getApiKey(req, res) {
  const userId = req.userId; // Get the user ID from the authenticated user (set by your AuthMiddleware)

  try {
    // Fetch the latest API key for the authenticated user
    const apiKey = await ApiKeyDao.getLatestApiKeyByUserId(userId);  // Your database query logic

    if (!apiKey) {
      return res.status(404).json({ message: 'No API key found for this user' });
    }

    // Send the API key in the response
    res.json({ apiKey: apiKey.key });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  static async revokeApiKey(req, res) {
    const { id } = req.params;
    const userId = req.userId; // Get the user ID from the request
  
    try {
      // Check if the API key belongs to the authenticated user
      const apiKey = await ApiKeyDao.getApiKeyById(id); // Fetch the key by ID
  
      if (!apiKey) {
        return res.status(404).json({ message: 'API key not found' });
      }
  
      if (apiKey.user_id !== userId) {
        return res.status(403).json({ message: 'You can only delete your own API keys' });
      }
  
      const deletedRows = await ApiKeyDao.deleteApiKey(id); // Delete the API key by its ID
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'Failed to delete API key' });
      }
  
      res.json({ message: 'API key revoked successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Update API key
  static async updateApiKey(req, res) {
    const { id } = req.params;
    const userId = req.userId; // Get user ID from the request (set by AuthMiddleware)
    const newApiKey = crypto.randomBytes(32).toString('hex'); // Generate new API key

    try {
      const updatedRows = await ApiKeyDao.updateApiKey(id, newApiKey, userId);
      if (updatedRows === 0) {
        return res.status(404).json({ message: 'API key not found or not authorized to update' });
      }
      res.json({ message: 'API key updated successfully', apiKey: newApiKey });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ApiKeyController;