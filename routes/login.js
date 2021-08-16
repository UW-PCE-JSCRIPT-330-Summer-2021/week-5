const { Router } = require("express");
const router = Router();
const userDAO = require('../daos/user');
const { isAuthorized } = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = "mySecret"

router.post("/signup", async (req, res) => {
  const signUp = req.body;
  const email = signUp.email;
  const password = signUp.password;
  if (!password || !email || password === '') {
    return res.sendStatus(400)
  }  
  try {
      const user = await userDAO.getUser(email);
      if (user) {
        return res.sendStatus(409)
      } else {
        const hash = await bcrypt.hash(password, 10);
        const newUser = await userDAO.createUser({ email, password: hash });
        return res.json(newUser)
      }
  } catch(e) {
    return res.status(500).send(e.message)
  }
});

router.post("/", async (req, res) => {
  const login = req.body;
  const email = login.email;
  const password = login.password;
  if (!email || email === '') {
    return res.sendStatus(401)
  } 
  if (!password || password === '') {
    return res.sendStatus(400)
  }
  try {
    const user = await userDAO.getUser(email);
    if (!user) {
      return res.sendStatus(401)
    } 
    bcrypt.compare(password, user.password, async (error, result) => {
      if (error || !result) {
        return res.sendStatus(401)
      } else {
        const data = {
          email: user.email,
          _id: user._id,
          roles: user.roles
        }
        const token = jwt.sign(data, SECRET);
        return res.json({ token });
      }
    });
  } catch(e) {
    return res.status(500).send(e.message)
  }
});

router.post("/password", isAuthorized, async (req, res) => {
  const password = req.body.password;
  if (!password || password === '') {
    return res.sendStatus(400)
  } else {
    try {
      const hash = await bcrypt.hash(password, 10);
      const passwordUpdated = await userDAO.updateUserPassword(req.user._id, hash);
      return res.sendStatus(passwordUpdated ? 200 : 400)
    } catch(e) {
      return res.status(500).send(e.message)
    }
  }
});

module.exports = router;