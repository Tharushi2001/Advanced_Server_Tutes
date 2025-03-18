// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        
        if (!result) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }

        // Set JWT in HTTP-only cookie
        res.cookie('jwt', result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Set CSRF token in cookie
        res.cookie('csrf-token', result.csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        // Send user data and CSRF token in response
        res.json({
            message: 'Login successful',
            user: result.user,
            csrfToken: result.csrfToken
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});