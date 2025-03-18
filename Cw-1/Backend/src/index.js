const express = require('express');
require('dotenv').config();
const db = require('./config/db'); // Import the database connection
const authRoutes = require('./routes/authRoutes');
const countryRoutes = require('./routes/countryRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes); // Use country routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});