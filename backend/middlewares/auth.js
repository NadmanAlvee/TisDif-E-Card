const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized: No Token Provided' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <TOKEN>"

    try {
        // Verify token with JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Extract and assign values to req object for further use
        req.username = decoded.username;
        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};

module.exports = authGuard;
