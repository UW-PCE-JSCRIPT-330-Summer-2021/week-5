const jwt = require('jsonwebtoken');
const secretKey = 'super_secret_key';


const isAuthorized = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401);
    }
    try {
        const decoded = jwt.verify(token, secretKey.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    } next()
};

const isAdmin = async (req, res, next) => {
    const user = req.user;
    if (user.roles.includes("admin")) {
        req.user.isAdmin = true;
    } else {
        next()
        }
};

module.exports = { isAuthorized, isAdmin, secretKey };