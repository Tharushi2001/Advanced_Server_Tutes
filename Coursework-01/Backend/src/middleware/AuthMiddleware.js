const jwt = require('jsonwebtoken');
const UserDao = require('../dao/UserDao');

class AuthMiddleware {
  static checkAuth(req, res, next) {   // Middleware to check JWT from Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Expecting header format: Authorization: Bearer <token>

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      req.userId = decoded.id; // Store user ID in request for later use
      next(); // Proceed to next middleware or route
    });
  }
}

module.exports = AuthMiddleware;