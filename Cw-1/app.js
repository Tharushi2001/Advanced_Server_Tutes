// app.js
const express = require('express');
const dotenv = require('dotenv');
const db = require('./db');
const countriesRoutes = require('./routes/countries');
const auth = require('./middleware/auth');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
app.use(express.json());

// Use the countries routes
app.use('/api/auth', authRoutes); // Add authentication routes
app.use('/api', countriesRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});