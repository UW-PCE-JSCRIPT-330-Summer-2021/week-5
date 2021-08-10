const { Router } = require("express");
const router = Router({ mergeParams: true });
const { ACCESS_TOKEN_SECRET, isAuthorized } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userDAO = require('../daos/user');

// Signup: `POST /login/signup`
router.post('/signup', async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userDAO.getUser(email);  
  try {
    if (!user) {
      if (!password || password.length === 0) {
         res.status(400).send('Password is empty');
       } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userDAO.createUser({email, password: hashedPassword});
        res.json(newUser);  
       }
    } else {
      res.status(409).send('Repeat sign up');
    }
  } catch (e) {
    next(e);
  }
})

// Login: `POST /login`
router.post('/', async (req, res, next) => {
  const { email, password } = req.body;
  if (!password || password.length === 0) {
    res.status(400).send('Password is empty');
  }
  try {
    const user = await userDAO.getUser(email);
    if (!user || user.length === 0) {
      res.sendStatus(401);
    }
    if (await bcrypt.compare(password, user.password)) {
      jwt.sign({
        email: user.email,
        _id: user._id,
        roles: user.roles
      }, ACCESS_TOKEN_SECRET, (error, token) => {
        res.json({token});
      })
    } else {
      res.status(401).send('Password is incorrect');
    }
  } catch (e) {
    next(e);
  }
  
})

router.post('/logout', async (req, res, next) => {
  res.status(404).send('Successfully logged out')
})

router.use(isAuthorized);

// // Change Password `POST /login/password`
router.post('/password', async (req, res, next) => {
  try {
    const password = req.body.password;
    if (!password || password == '') {
      res.status(400).send('Password is empty');
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userDAO.updatePassword(req.user._id, hashedPassword);
    res.status(200).send('Password successfully changed') 
  } catch (e) {
    next(e)
  }
})

module.exports = router;