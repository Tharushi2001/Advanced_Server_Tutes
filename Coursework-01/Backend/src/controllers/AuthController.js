const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserDao = require('../dao/UserDao');
const ApiKeyDao = require('../dao/ApiKeyDao');
const LogDao = require('../dao/LogDao');
const crypto = require('crypto');

class AuthController {
  static async register(req, res) {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
      const userId = await UserDao.createUser(username, hashedPassword);
      const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
      await LogDao.createLog(userId, 'User registered', `User ${username} registered successfully.`);
      res.status(201).json({ id: userId, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;

    try {
      if (req.session.userId) {
        return res.status(400).json({ message: 'User already logged in' });
      }
  
      // Corrected method name
      const user = await UserDao.getUserByUsername(username);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      //generate API key
      const apiKey = crypto.randomBytes(32).toString('hex');
      await ApiKeyDao.createApiKey(apiKey, user.id);

      //start a session
      req.session.userId=user.id;

        // Debugging log
        console.log('Session after login:', req.session);


      await LogDao.createLog(user.id, 'User logged in', `User ${username} logged in successfully and API key generated.`);
    
      res.json({ message: `User ${username} logged in successfully.`, apiKey });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

 
  static async logout(req, res) {
    try {
      console.log('Session at logout:', req.session)
      // Check if the user is logged in
      if (!req.session.userId) {
        return res.status(400).json({ message: 'User  is not logged in' });
      }
  
      // Log the logout action
      await LogDao.createLog(req.session.userId, 'User  logged out', `User  with ID ${req.session.userId} logged out successfully.`);
  
      // Destroy the session
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ error: 'Could not log out. Please try again.' });
        }
  
        // Optionally, you can clear the session cookie
        res.clearCookie('connect.sid'); // Replace 'connect.sid' with your session cookie name if different
  
        res.json({ message: 'User  logged out successfully.' });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  
}

module.exports = AuthController;
