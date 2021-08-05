const jwt = require('jsonwebtoken')
const privateKey = require('../secret');

const isAuthorized = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).send('Unauthorized - Not logged in');
  } else {
    const tokenString = token.split(' ')[1];
    jwt.verify(tokenString, privateKey, (err, decoded) => {
        if (err || !decoded) {
            res.status(401).send('Unauthorized - Incorrect login info');
        } else {
            req.userInfo = decoded;
            next();
        }
    });
  }
}

const isAdmin = async (req, res, next) => {
  req.isAdmin = req.userInfo.roles.includes("admin");
  next();
}

module.exports = { isAuthorized, isAdmin };