const db = require('../config/db');

class LogDao {
  static createLog(userId, action, details) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)', [userId, action, details], (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      });
    });
  }

  static getLogsByUserId(userId) { // Fixed method name here
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM logs WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getAllLogs() {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM logs', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
}

module.exports = LogDao;
