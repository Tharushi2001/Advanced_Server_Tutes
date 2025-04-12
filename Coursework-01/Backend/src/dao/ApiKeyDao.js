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

  static getLatestApiKeyByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM api_keys WHERE user_id = ? ORDER BY id DESC LIMIT 1',
        [userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]); // Return the latest API key
        }
      );
    });
  }
  
  static getApiKeyById(id) {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM api_keys WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // Return the first result, or null if not found
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

  static updateApiKey(id, newKey, userId) {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE api_keys SET `key` = ? WHERE id = ? AND user_id = ?',
        [newKey, id, userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.affectedRows); // This will return the number of updated rows
        }
      );
    });
  }

  static deleteApiKey(id, userId) {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM api_keys WHERE id = ? AND user_id = ?',
        [id, userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results.affectedRows); // Number of deleted rows
        }
      );
    });
  }
  
  
  


}

module.exports = ApiKeyDao;