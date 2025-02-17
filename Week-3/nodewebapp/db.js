
const mysql = require('mysql2/promise');

// Create and export the connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Your MySQL username
  password: '',  // Your MySQL password
  database: 'users_db', // The name of your database
});

// Export the pool for use in other files
module.exports = pool;
