const db = require('../config/db');
const bcrypt = require('bcrypt');

const UserDao = {
    // Create a new user in the database
    async createUser(username, password, apiKey) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            const query = 'INSERT INTO users (username, password, apiKey) VALUES (?, ?, ?)';
            await db.query(query, [username, hashedPassword, apiKey]);
            return { success: true, message: 'User created successfully' };
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error('Unable to create user');
        }
    },

    // Get a user by their username
    async getUserByUsername(username) {
        try {
            const query = 'SELECT * FROM users WHERE username = ?';
            const results = await db.query(query, [username]);
            return results.length ? results[0] : null;
        } catch (error) {
            console.error("Error fetching user by username:", error);
            throw new Error('Error fetching user');
        }
    },

    // Get a user by their user ID
    async getUserById(userId) {
        try {
            const query = 'SELECT * FROM users WHERE id = ?';
            const results = await db.query(query, [userId]);
            return results.length ? results[0] : null;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw new Error('Error fetching user');
        }
    }
};

module.exports = UserDao;
