const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from `Authorization: Bearer <token>`

    if (!token) {
        // return res.redirect('/login'); 
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next(); // Continue to the next middleware
    } catch (error) {
        res.redirect('/login');
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};
