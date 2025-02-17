// UserDAO.js - MySQL Database Implementation
const db = require('./db');  // Import the db.js module

class UserDAO {
  async getAllUsers() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  }

  async getUserById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  async createUser(user) {
    const [result] = await db.query('INSERT INTO users (name, email) VALUES (?, ?)', [user.name, user.email]);
    return result.insertId;
  }

  async updateUser(id, user) {
    await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [user.name, user.email, id]);
  }

  async deleteUser(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = new UserDAO();
