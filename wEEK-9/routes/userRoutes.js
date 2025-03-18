// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/auth');
const { csrfProtection } = require('../middleware/csrf');

// Apply both JWT and CSRF protection
router.use(authenticateJWT);
router.use(csrfProtection);

// Protected route example
router.put('/profile', async (req, res) => {
    try {
        // User is already verified through middleware
        const userId = req.user.id;
        // Update profile logic here
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});