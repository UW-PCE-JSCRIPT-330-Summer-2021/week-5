const { Router } = require("express");
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDAO = require('../daos/user');
const { isAuthorized, secret } = require('../middleware/auth');
const { errorHandler } = require('../middleware/error');


// Signup: POST /login/signup
// Should use bcrypt on the incoming password. 
// Store user with their email and encrypted password, 
// handle conflicts when the email is already in use.
router.post("/signup", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password || email === '' || password === '') {
      res.sendStatus(400);
    } else {
      const existingEmail = await userDAO.getUser(email);
      if (existingEmail) {
        res.sendStatus(409);
      } else {
        const savedHash = await bcrypt.hash(password, 10);
        const newUser = await userDAO.createUser({ email, password: savedHash });
        res.json(newUser);
      }
    }
  } catch (e) {
    next (e);
  }
});

// Login: POST /login
// POST / - find the user with the provided email. 
// Use bcrypt to compare stored password with the incoming password. 
// If they match, generate a token with JWT and return it to the user.
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
      const data = { email: existingEmail.email, roles: existingEmail.roles, _id: existingEmail._id };
      let token = jwt.sign(data, secret);
      res.json({ token });
    }
  } catch (e) {
    next (e);
  }
});

// Change Password POST /login/password
// POST /password - If the user is logged in, store the incoming password using their userId
router.post("/password", isAuthorized, async (req, res, next) => {
  try {
    const password = req.body.password;
    if (!password || password === '') {
      res.sendStatus(400);
    } else {
      const savedHash = await bcrypt.hash(password, 10);
      const changedPassword = await userDAO.updateUserPassword(req.user._id, savedHash);
      res.sendStatus(changedPassword ? 200 : 400);
    }
  } catch (e) {
    res.sendStatus(401);
  }
});


router.use(errorHandler);

module.exports = router;