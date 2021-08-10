const jwt = require('jsonwebtoken');
const secret = 'my_super_secret';

//isAuthorized middleware
async function isAuthorized (req, res, next) {
  const bearerToken = req.headers.authorization;
  try {
    if (bearerToken) {
      const tokenString = bearerToken.replace('Bearer ', '');
      const decoded = jwt.verify(tokenString, secret);
      if (!decoded) {
        res.sendStatus(401);
      } else {
        req.user = decoded;
        next();
      }
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    res.sendStatus(401);
  }
};

async function isAdmin (req, res, next) {
  if (req.user.roles.includes('admin')) {
    req.user.isAdmin = true;
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = { isAuthorized, secret, isAdmin };