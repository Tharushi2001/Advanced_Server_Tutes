const ApiKeyDao = require('../dao/ApiKeyDao');

class ApiKeyMiddleware {   // Middleware to validate API key from request header
  static async validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key']; // Custom header to pass API key

    if (!apiKey) {
      return res.status(403).json({ message: 'No API key provided' });
    }

    try {
      const keyData = await ApiKeyDao.getApiKeyByKey(apiKey);
      if (!keyData) {
        return res.status(401).json({ message: 'Invalid API key' });
      }

      req.userId = keyData.user_id; // Store user ID in request for later use
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ApiKeyMiddleware;