const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'my super secret';
const userDAO = require('../daos/user');

// Signup: POST /login/signup
// Should use bcrypt on the incoming password. 
// Store user with their email and encrypted password, 
// handle conflicts when the email is already in use.
router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password || email === '' || password === '') {
      res.sendStatus(400);
    }
    const existingEmail = await userDAO.getUser(email);
    if (existingEmail) {
      res.sendStatus(409);
    } else {
      const savedHash = await bcrypt.hash(password, 10);
      const newUser = await userDAO.createUser({ email, password: savedHash });
      res.json(newUser);
    }
  } catch (e) {
    next (e);
  }
})

// Login: POST /login
// POST / - find the user with the provided email. 
// Use bcrypt to compare stored password with the incoming password. 
// If they match, generate a random token with JWT and return it to the user.
router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
      res.sendStatus(400);
    }
    const existingEmail = await userDAO.getUser(email);
    if (!existingEmail) {
      res.sendStatus(401);
    }
    let match = await bcrypt.compare(password, existingEmail.password);
    if (!match) {
      res.sendStatus(401);
    } else {
      let token = jwt.sign(match, secret);
      res.json(token);
    }
  } catch (e) {
    next (e);
  }
})

// Change Password POST /login/password
// POST /password - If the user is logged in, store the incoming password using their userId
router.post("/password", isLoggedIn, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!password || password === '') {
      res.sendStatus(400);
    } else {
      const savedHash = await bcrypt.hash(password, 10);
      const changedPassword = await userDAO.updateUserPassword(email, savedHash);
      res.json(changedPassword);
    }
  } catch (e) {
    next (e);
  }
});

//isLoggedIn
const isLoggedIn = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  if (!token || !token.indexOf('Bearer ') === 0) {
    res.sendStatus(401);
  } else {
    token = token.replace('Bearer ', '');
    const tokenWithUser = await Token.aggregate([
      { $match: { token } },
      { $lookup: { from: 'users', localField: 'userId',
        foreignField: '_id', as: 'user' } }
    ]);
    if (!tokenWithUser || !tokenWithUser.user) {
      res.sendStatus(401);
    } else {
      req.user = tokenWithUser.user;
      next();
    }
  }
  // try {
  //   if (jwtToken) {
  //     jwt.verify(jwtToken, secret);
  //   }
  // } catch (e) {
  //   next (e);
  // }
}

// isAuthorized middleware, req.headers.authorization


module.exports = router;