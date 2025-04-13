const db = require('../config/db');

class LogDao {
  static createLog(userId, action, details) {    // Create a new log entry
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)', [userId, action, details], (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      });
    });
  }
}

module.exports = LogDao;