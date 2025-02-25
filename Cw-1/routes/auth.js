const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const crypto = require('crypto');
const auth = require('../middleware/auth');

const router = express.Router();

// Function to generate a secure API key
function generateApiKey() {
    return crypto.randomBytes(32).toString('hex'); // 64-character API key
}

// ✅ User Registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if username already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = generateApiKey();

        await db.query(
            'INSERT INTO users (username, password, apiKey) VALUES (?, ?, ?)',
            [username, hashedPassword, apiKey]
        );

        res.status(201).json({ message: "User registered successfully.", apiKey });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;
