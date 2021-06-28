const jwt = require('jsonwebtoken');
const User =require('../models/User');

module.exports = async  (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        const user = await User.findById(userId);
        if (!user) {
            throw 'Invalid user ID';
        } else {
            req.loggedUser = user;
            next();
        }
    } catch (e) {
        res.status(401).json({
            error: new Error('Invalid request!'),
        });
    }
};