// config/db.js
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

module.exports = db;
