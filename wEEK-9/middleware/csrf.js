// middleware/csrf.js
const { verifyToken } = require('../config/csrf');

const csrfProtection = (req, res, next) => {
    // Skip CSRF check for non-state-changing requests
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        return next();
    }

    const token = req.headers['x-csrf-token'];
    const cookieToken = req.cookies['csrf-token'];

    if (!token || !cookieToken || token !== cookieToken) {
        return res.status(403).json({ 
            error: 'Invalid CSRF token' 
        });
    }

    if (!verifyToken(token)) {
        return res.status(403).json({ 
            error: 'Invalid CSRF token' 
        });
    }

    next();
};