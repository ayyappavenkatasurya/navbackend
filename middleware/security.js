// server/middleware/security.js
const validateApiKey = (req, res, next) => {
    // In a real MNC app, this would be a rotated key or OAuth token
    // For this implementation, we check a header against env
    const apiKey = req.headers['x-api-key'];
    const validKey = process.env.API_SECRET_KEY || 'vision-ai-secure-key';

    if (apiKey && apiKey === validKey) {
        next();
    } else {
        res.status(401).json({ success: false, error: 'Unauthorized Access' });
    }
};

module.exports = { validateApiKey };