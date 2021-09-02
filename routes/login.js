const { Router } = require("express");
const bcrypt = require("bcrypt");
const router = Router();

const { isLoggedIn, isAdmin } = require("../middleware/auth");

const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');


router.post("/signup", async (req, res, next) => {
  try {
    const user = req.body;
    const userEmail = user.email;
    const userPassword = user.password;
    const userRoles = user.roles;
    const userSignedUp = await userDAO.getUser(userEmail);
    if (userSignedUp) {
      res.sendStatus(409);
    }
    if (!userEmail || userEmail.length === 0) {
      res.sendStatus(400);
    }
    if (!userPassword || userPassword.length === 0) {
      res.sendStatus(400);
    }
    else {
      const encryptedPassword = await bcrypt.hash(userPassword, 10);
      const signupInfo = ({ email: userEmail, password: encryptedPassword, roles: userRoles });
      const savedUser = await userDAO.createUser(signupInfo);
      res.json(savedUser);
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = req.body;
    if (!user.email) {
      res.status(400).send("Please porvide correct email");
    }
    if (!user.password || user.password == null) {
      res.status(400).send("Please porvide correct password");
    } else {
      const savedUser = await userDAO.getUser(user.email);
      const checkMatch = await bcrypt.compare(user.password, savedUser.password);
      if (!checkMatch) {
        res.status(401).send('Unauthorized - Wrong password');
      } else {
        const token = await tokenDAO.getJwtForUser(savedUser);
        res.json({ token });
      }
    }
  } catch (e) {
    if (e.message.includes('Cannot read property')) {
      res.status(401).send(e.message);
    } else {
      next(e);
    }
  }
});

router.post("/logout", async (req, res, next) => {
  res.sendStatus(404);
});

// router.use(isLoggedIn);

router.post("/password", async (req, res, next) => {
  try {
    const password = req.body.password;
    const userId = req.user._id;
    if (!password || password.length < 1) {
      res.status(400).send('password is required');
    } else {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const updated = await userDAO.updateUserPassword(userId, encryptedPassword);
      res.json(updated);
    }
  } catch (e) {
    next(e);
  }
});

// router.use(isAdmin);

router.get("/", async (req, res, next) => {
  try {
    const users = await userDAO.getAll();
    res.json(users);
  } catch (e) {
    next(e);
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const user = await userDAO.removeById(req.params.id);
    if (!user) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    next(e);
  }
});
module.exports = router;
