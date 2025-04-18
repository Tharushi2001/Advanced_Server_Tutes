const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserDao = require('../dao/UserDao');
const ApiKeyDao = require('../dao/ApiKeyDao');
const LogDao = require('../dao/LogDao');
const crypto = require('crypto');

class AuthController {

  static async register(req, res) {    // User registration endpoint
    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password for security
      const userId = await UserDao.createUser(username, hashedPassword);// Store new user and retrieve their ID
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });// Generate a JWT token valid for 1 hour

      await LogDao.createLog(userId, 'User registered', `User ${username} registered successfully.`);  // Log the registration
      res.status(201).json({ id: userId, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {   // User login endpoint
    const { username, password } = req.body;

    try {
      if (req.session.userId) { // Prevent multiple logins in same session
        return res.status(400).json({ message: 'User already logged in' });
      }

      const user = await UserDao.getUserByUsername(username); // Fetch user details by username
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate API key
      const apiKey = crypto.randomBytes(32).toString('hex');
      await ApiKeyDao.createApiKey(apiKey, user.id);

      // Start a session
      req.session.userId = user.id;

      console.log('Session after login:', req.session);

      await LogDao.createLog(user.id, 'User logged in', `User ${username} logged in successfully and API key generated.`);
      res.json({ message: `User ${username} logged in successfully.`, apiKey });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logout(req, res) {
    try {
      console.log('Session at logout:', req.session); // Log the session for debugging
      
      if (!req.session.userId) {
        return res.status(400).json({ message: 'User is not logged in' });
      }
  
      // Log the logout action
      await LogDao.createLog(req.session.userId, 'User logged out', `User with ID ${req.session.userId} logged out successfully.`);
      
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ error: 'Could not log out. Please try again.' });
        }
  
        
        res.clearCookie('connect.sid', { path: '/', httpOnly: true }); 
  
        console.log('Session destroyed and cookie cleared.');
        
        return res.json({ message: 'User logged out successfully.' });
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ error: error.message });
    }
  }
  
  
  
  
}

module.exports = AuthController;
