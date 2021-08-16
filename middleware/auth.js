const jwt = require('jsonwebtoken')
const SECRET = "mySecret"

const isAuthorized = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.sendStatus(401)
  } 
  const token = authorization.replace('Bearer ', '');
  try {
    const decodedToken = jwt.verify(token, SECRET);
    if (decodedToken) {
      req.user = decodedToken;
      next();
    }
  } catch (e) {
      return res.status(401).send(e.message)
  } 
}

const isAdmin = async (req, res, next) => {
  if (req.user.roles.includes("admin")) {
    req.isAdmin = true;
  } 
  next();
}

module.exports = { isAuthorized, isAdmin };