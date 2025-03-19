const db = require('../config/db');

class ApiKeyDao {
  static createApiKey(key, userId) {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO api_keys (`key`, user_id) VALUES (?, ?)', [key, userId], (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      });
    });
  }

  static getApiKeysByUserId(userId) { // Fixed method name here
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM api_keys WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static deleteApiKeyByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM api_keys WHERE id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results.affectedRows);
      });
    });
  }

  static getApiKeyByKey(key) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM api_keys WHERE `key` = ?', [key], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
}

module.exports = ApiKeyDao;
