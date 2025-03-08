const bcrypt = require('bcryptjs');
const UserDao = require('../daos/userDao');
const crypto = require('crypto');

// Function to generate a secure API key
function generateApiKey() {
    return crypto.randomBytes(16).toString('hex'); // 32-character API key
}

exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const users = await UserDao.getUserByUsername(username);
        if (Array.isArray(users) && users.length > 0) {
            return res.status(400).json({ message: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = generateApiKey();

        await UserDao.addUser(username, hashedPassword, apiKey);
        res.status(201).json({ message: "User registered successfully.", apiKey });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const users = await UserDao.getUserByUsername(username);
        if (users.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = users[0]; // Assuming the user array contains one object
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        res.json({ message: 'Login successful', apiKey: user.apiKey });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
