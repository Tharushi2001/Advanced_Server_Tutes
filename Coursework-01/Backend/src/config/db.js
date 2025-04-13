const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({ // Create a connection to the MySQL database
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {  // Connect to the database and handle errors
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection;