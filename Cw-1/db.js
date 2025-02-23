// Load environment variables early
require('dotenv').config();

const mysql = require('mysql');
const util = require('util');

// Create the connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Leave blank if no password
    database: process.env.DB_NAME
});

// Test the connection
db.connect((err) => {
    if (err) {
        console.error('MySQL Connection Error:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Promisify for Node.js async/await
db.query = util.promisify(db.query);

// Setup the database tables if they do not exist
async function setupDatabase() {
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            apiKey VARCHAR(255) NOT NULL
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS api_usage (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            endpoint VARCHAR(255),
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )`);
        
        console.log('Database setup completed');
    } catch (error) {
        console.error('Error setting up database:', error);
    }
}

setupDatabase();

module.exports = db;
