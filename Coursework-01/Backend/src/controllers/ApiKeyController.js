const ApiKeyDao = require('../dao/ApiKeyDao');
const crypto = require('crypto');
const LogDao = require('../dao/LogDao');

class ApiKeyController {

  static async generateApiKey(req, res) {
    const userId = req.userId; // Get user ID from the request (set by AuthMiddleware)
    const apiKey = crypto.randomBytes(32).toString('hex');

    try {
      const apiKeyId = await ApiKeyDao.createApiKey(apiKey, userId);
      await LogDao.createLog(userId, 'API Key Generated', `API key created with ID ${apiKeyId}`);
      res.status(201).json({ id: apiKeyId, apiKey });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
 
  // In ApiKeyController.js
  static async getApiKey(req, res) {
    const userId = req.userId;
  
    try {
      const apiKey = await ApiKeyDao.getLatestApiKeyByUserId(userId);
  
      if (!apiKey) {
        return res.status(404).json({ message: 'No API key found for this user' });
      }
  
      res.json({ id: apiKey.id, apiKey: apiKey.key });  // ✅ Send both ID and key
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
      await LogDao.createLog(userId, 'API Key Updated', `API key with ID ${id} was updated.`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  static async deleteApiKey(req, res) {
    const { id } = req.params;
    const userId = req.userId; // Make sure this is set by your authentication middleware
  
    try {
      const deletedRows = await ApiKeyDao.deleteApiKey(id, userId); // 💥 pass userId here
      if (deletedRows === 0) {
        return res.status(404).json({ message: 'API key not found or not owned by user' });
      }
  
      await LogDao.createLog(userId, 'API Key Deleted', `API key with ID ${id} was deleted.`);
      res.json({ message: 'API key deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  
}

module.exports = ApiKeyController;