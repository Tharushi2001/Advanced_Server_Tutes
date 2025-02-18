const express = require('express');
const apiKeyMiddleware = require('./middleware/apiKeyAuth');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(express.json());

app.use('/admin', adminRoutes);
app.use('/api', apiKeyMiddleware);

app.get('/api/data', (req, res) => {
    res.json({
        message: 'Protected data accessed successfully',
        keyInfo: {
            name: req.apiKey.name,
            lastUsed: req.apiKey.last_used
        }
    });
});