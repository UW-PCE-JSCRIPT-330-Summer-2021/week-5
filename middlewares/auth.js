const jwt = require('jsonwebtoken')
const key = require('../key');

const isAllowed = async (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization;
        if (!tokenHeader) {
            res.sendStatus(401);
            return;
        } else {
            const token = tokenHeader.split(' ')[1];
            jwt.verify(token, key, (error, decoded) => {
                if (error || !decoded) {
                    res.sendStatus(401);
                } else {
                    req.userInfo = decoded;
                    next();
                }
            });
        }
    } catch (e) {
        next(e);
    }
};

const isAdmin = async (req, res, next) => {
    req.isAdmin = req.userInfo.roles.includes('admin');
    next();
};

module.exports = { isAllowed, isAdmin };
