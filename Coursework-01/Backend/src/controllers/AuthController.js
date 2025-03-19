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

      await LogDao.createLog(user.id, 'User logged in', `User ${username} logged in successfully and API key generated.`);
      res.json({ apiKey });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static logout(req,res){
    req.session.destroy(err=>{
      if(err){
        return res.status(500).json({message:'could not logout'});
      }
      res.json({message:'Logout successfull'});
    });
  }
}

module.exports = AuthController;
