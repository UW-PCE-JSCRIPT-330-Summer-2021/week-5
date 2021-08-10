const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = Router();

const userDAO = require("../daos/user");
const privateKey = require("../secret");
const { isAuthorized } = require("../middlewares/auth");
const { errorHandler } = require("../middlewares/error");

// Change password
router.post("/password", isAuthorized, async (req, res, next) => {
  const password = req.body.password;
  if (!password || password === "") {
    res.status(400).send("Bad request - Missing new password");
  } else {
    try {
      const encryptedPW = await bcrypt.hash(password, 10);
      const success = await userDAO.updateUserPassword(
        req.userInfo._id,
        encryptedPW
      );
      res.sendStatus(success ? 200 : 400);
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
});

// Signup
router.post("/signup", async (req, res, next) => {
  const signupInfo = req.body;
  const email = signupInfo.email;
  const password = signupInfo.password;
  if (!password || !email || password === "") {
    res.status(400).send("Bad request - Missing signup info");
  } else {
    try {
      const user = await userDAO.getUser(email);
      if (user) {
        res.status(409).send("Conflict - Email already signed up");
      } else {
        encryptedPW = await bcrypt.hash(signupInfo.password, 10);
        newSignupInfo = { email, password: encryptedPW };
        let saveduser = await userDAO.createUser(newSignupInfo);
        saveduser = saveduser.toObject();
        delete saveduser.password;
        res.json(saveduser);
      }
    } catch (e) {
      next(e);
    }
  }
});

// Login
router.post("/", async (req, res, next) => {
  const loginInfo = req.body;
  const email = loginInfo.email;
  const password = loginInfo.password;
  if (!email || email === "") {
    res.status(401).send("Unauthorized - Missing login email");
  } else {
    try {
      const user = await userDAO.getUser(email);
      if (!user) {
        res.status(401).send("Unauthorized - User not found");
      } else {
        if (!password || password === "") {
          res.status(400).send("Bad request - No password provided");
        } else {
          bcrypt.compare(password, user.password, async (error, result) => {
            if (error || !result) {
              res.status(401).send("Unauthorized - Wrong password");
            } else {
              const token = jwt.sign(
                { email: user.email, _id: user._id, roles: user.roles },
                privateKey
              );
              res.json({ token });
            }
          });
        }
      }
    } catch (e) {
      next(e);
    }
  }
});

// Error handle middleware
router.use(errorHandler);

module.exports = router;
