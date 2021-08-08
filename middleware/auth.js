const jwt = require('jsonwebtoken');
const secret = 'my super secret';

//isAuthorized middleware
async function isAuthorized (req, res, next) {
  const bearerToken = req.headers.authorization;
  try {
    if (bearerToken) {
      const tokenString = bearerToken.replace('Bearer ', '');
      const decoded = jwt.verify(tokenString, secret);
      if (decoded) {
        req.user = decoded;
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    res.sendStatus(401);
  }
};

module.exports = { isAuthorized, secret };