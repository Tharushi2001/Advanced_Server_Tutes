const db = require('../config/db'); // Import the db instance with promise support

const apiKeyAuth = async (req, res, next) => {
    const apiKey = req.headers['api-key']; // API key passed in headers as 'api-key'

    if (!apiKey) {
        return res.status(400).json({ message: 'API key is required' });
    }

    console.log('Received API key:', apiKey); // Log the received API key

    try {
        const [user] = await db.query('SELECT * FROM users WHERE apiKey = ?', [apiKey]);

        console.log('Database query result:', user); // Log the result from the database

        if (!user || user.length === 0) {
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

