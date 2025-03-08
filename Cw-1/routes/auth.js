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

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if database query returns results correctly
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        console.log("Database Query Result:", rows); 

        if (Array.isArray(rows) && rows.length > 0) {
            return res.status(400).json({ message: "Username already exists." });
        }

        //  Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //  Generate API Key 
        const apiKey = require('crypto').randomBytes(16).toString('hex');

        //  Insert new user
        const insertQuery = 'INSERT INTO users (username, password, apiKey) VALUES (?, ?, ?)';
        await db.query(insertQuery, [username, hashedPassword, apiKey]);

        res.status(201).json({ message: "User registered successfully.", apiKey });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const users = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: "Login successful.", token, apiKey: user.apiKey });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// User Profile (Protected Route)
router.get('/profile', auth, async (req, res) => {
    try {
        const users = await db.query('SELECT username, apiKey FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(users[0]);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
