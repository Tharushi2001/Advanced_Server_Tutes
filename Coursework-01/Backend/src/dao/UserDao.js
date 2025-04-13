const db = require('../config/db');

class UserDao {
  static createUser(username, password) {   // Create a new user with hashed password
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);  // Return new user ID
      });
    });
  }

  static getUserByUsername(username) {      // Fetch user details by username (for login)
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }

}

module.exports = UserDao;
