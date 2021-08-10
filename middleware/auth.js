const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = 'c28e7191d0ce27ccf4f5496ab9b87b5625fe5fa0041e3c6abcc2b4db940365fea1a2f22aacfbae22a80080466456ee5d4eab23827b01871beb065e5fe743f661';

const isAuthorized = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader.length === 0) {
    res.sendStatus(401);
  }
  try {
    const clientToken = authHeader.replace('Bearer ', '');
    const accessToken = jwt.verify(clientToken, ACCESS_TOKEN_SECRET);
    if (accessToken) {
      req.user = accessToken;
      next();
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
      res.status(401).send('Bad token');
      next(e);
  } 
}

const isAdmin = (req, res, next) => {
  if (req.user.roles.includes("admin")) {
    req.user.isAdmin = true
  }
  next()
  }

 
module.exports = { ACCESS_TOKEN_SECRET, isAuthorized, isAdmin }