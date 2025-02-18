const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    
    if (!apiKey) {
        return res.status(401).json({
            error: 'API key missing'
        });
    }

    try {
        const keyData = await ApiKey.validate(apiKey);
        if (!keyData) {
            return res.status(403).json({
                error: 'Invalid API key'
            });
        }

        req.apiKey = keyData;
        next();
    } catch (error) {
        console.error('API key validation error:', error);
        res.status(500).json({
            error: 'Error validating API key'
        });
    }
};