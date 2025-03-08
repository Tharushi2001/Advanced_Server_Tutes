require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const countryRoutes = require("./routes/countryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes); // Authentication routes (Login, Register, API Key)
app.use("/api", countryRoutes); // Country data routes

// Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the Secure RestCountries API Service!");
});

// Server Setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
