const jwt = require('jsonwebtoken');
const secret = 'my_super_secret';

//isAuthorized middleware
async function isAuthorized (req, res, next) {
  const bearerToken = req.headers.authorization;
  try {  
    if (!bearerToken) {
      res.sendStatus(401);
      return;
    } 
    const tokenString = bearerToken.replace('Bearer ', '');
      const decoded = jwt.verify(tokenString, secret);
      if (!decoded) {
        res.sendStatus(401);
      } else {
        req.user = decoded;
        next();
      }
  } catch (e) {
    res.sendStatus(401);
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.roles.includes('admin')) {
    req.user.isAdmin = true;
  } 
  next();
}

module.exports = { isAuthorized, secret, isAdmin };