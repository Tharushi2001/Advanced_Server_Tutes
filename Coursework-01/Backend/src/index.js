//Tharushi Amarabandu-20211525/w1907403

const express = require('express');
const session=require('express-session');
require('dotenv').config();
const db = require('./config/db'); 
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const countryRoutes = require('./routes/countryRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  credentials: true // allow cookies
}));


app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'restcountry@123', // Ensure session secret is set
    resave: false,
    saveUninitialized: false,  // Create session only when needed
    cookie: {
        secure: process.env.NODE_ENV === 'production', // secure cookies in production
        httpOnly: true,
        maxAge: 3600000 // 1 hour in milliseconds
      }
  }));

// Routes
app.use('/api/auth', authRoutes);//Use auth routes
app.use('/api/countries', countryRoutes); // Use country routes
app.use('/api/apikeys', apiKeyRoutes); // API key routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});