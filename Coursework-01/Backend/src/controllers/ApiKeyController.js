const ApiKeyDao = require('../dao/ApiKeyDao');
const crypto = require('crypto');
const LogDao = require('../dao/LogDao');

class ApiKeyController {
 
  static async generateApiKey(req, res) {   // Generate a new API key for the logged-in user
    const userId = req.userId; // Get user ID from the request 
    const apiKey = crypto.randomBytes(32).toString('hex'); // Generate a secure random 64-character hex string


    try {
      const apiKeyId = await ApiKeyDao.createApiKey(apiKey, userId);
      await LogDao.createLog(userId, 'API Key Generated', `API key created with ID ${apiKeyId}`); // Log the action
      res.status(201).json({ id: apiKeyId, apiKey });  // Return the new key
    } catch (error) {
      res.status(500).json({ error: error.message }); // Handle server error
    }
  }
 
  
  static async getApiKey(req, res) {   // Retrieve the most recent API key for the logged-in user
    const userId = req.userId;
  
    try {
      const apiKey = await ApiKeyDao.getLatestApiKeyByUserId(userId);  // Fetch the latest key
  
      if (!apiKey) {
        return res.status(404).json({ message: 'No API key found for this user' });
      }
  
      res.json({ id: apiKey.id, apiKey: apiKey.key });  // Send both ID and key
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
     
  // Update API key
  static async updateApiKey(req, res) {
    const { id } = req.params;  // ID of the API key to update
    const userId = req.userId; // Get user ID from the request (set by AuthMiddleware)
    const newApiKey = crypto.randomBytes(32).toString('hex'); // Generate new API key

    try {
      const updatedRows = await ApiKeyDao.updateApiKey(id, newApiKey, userId);// Update in DB
      if (updatedRows === 0) {
        return res.status(404).json({ message: 'API key not found or not authorized to update' });
      }
      res.json({ message: 'API key updated successfully', apiKey: newApiKey });
      await LogDao.createLog(userId, 'API Key Updated', `API key with ID ${id} was updated.`);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


  static async deleteApiKey(req, res) {    // Delete an API key for the current user
    const { id } = req.params;   // API key ID from route params         
    const userId = req.userId; 
  
    try {
      const deletedRows = await ApiKeyDao.deleteApiKey(id, userId); // Delete from DB
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