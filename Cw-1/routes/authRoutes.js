const express = require('express');
const bcrypt = require('bcrypt');
const UserDao = require('../dao/userDao');
const UsageDao = require('../dao/UsageDao');  // Import UsageDao
const crypto = require('crypto');

const router = express.Router();

// User Registration (Signup)
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Generate a unique API key
        const apiKey = crypto.randomBytes(32).toString('hex');

        // Create user in database
        const result = await UserDao.createUser(username, password, apiKey);

        // Log API usage for the registration endpoint
        await UsageDao.logApiUsage(result.userId, '/register');  // Assuming `result.userId` is the newly created user ID

        return res.status(201).json({ message: 'User registered successfully', apiKey });
    } catch (error) {
        console.error('Registration Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Check if user exists
        const user = await UserDao.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Log API usage for the login endpoint
        await UsageDao.logApiUsage(user.id, '/login');  // Assuming `user.id` is the logged-in user ID

        // Return API Key without JWT token
        return res.json({ message: 'Login successful', apiKey: user.apiKey });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
