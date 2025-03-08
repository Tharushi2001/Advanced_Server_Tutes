const db = require('../config/db'); // Assuming db is using mysql2 with promise support

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['api-key']; // API key passed in headers as 'api-key'

    if (!apiKey) {
        return res.status(400).json({ message: 'API key is required' });
    }

    try {
        // Use db.promise() to handle async query properly with await
        const [user] = await db.promise().query('SELECT * FROM users WHERE apiKey = ?', [apiKey]);

        if (!user.length) {
            return res.status(403).json({ message: 'Invalid API key' });
        }

        req.user = user[0]; // Attach the user to the request for further use
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.error("API Key Authentication Error:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = apiKeyAuth;
