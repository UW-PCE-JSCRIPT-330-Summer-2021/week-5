const { Router } = require("express");
const router = Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userDAO = require('../daos/user');
const key = require('../key');

const { isAllowed } = require('../middlewares/auth');
const { errorHandler } = require('../middlewares/error');

// changing password
router.post("/password", isAllowed, async (req, res, next) => {
    try {
        const password = req.body.password;
        if (!password || JSON.stringify(password) === '{}') {
            res.sendStatus(400);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const updatedPassword = await userDAO.updateUserPassword(req.userInfo._id, hashedPassword);
            res.json(updatedPassword).sendStatus(200); 
        }
    } catch(e) {
        next(e);
    }
});

// signing
router.post("/signup", async (req, res, next) => {
    try {
        const signup = req.body;
        const email = signup.email;
        const password = signup.password;
        if (!password || !email || JSON.stringify(password) === '{}' || JSON.stringify(email) === '{}') {
            res.sendStatus(400);
        } else {
        const getUser = await userDAO.getUser(email);
            if (getUser) {
                res.sendStatus(409);
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const savedUser = await userDAO.createUser({ email: email, password: hashedPassword, roles: ['user'] });
                req.user = savedUser;
                res.sendStatus(200);
            }
        }
    } catch (e) {
        next(e);
    }
});

// logging in
router.post("/", async (req, res, next) => {
    try {
        const login = req.body;
        const email = login.email;
        const password = login.password;
        if (!email || JSON.stringify(email) === '{}') {
            res.sendStatus(401);
        }

        const existingUser = await userDAO.getUser(email);
            if (!existingUser) {
                res.sendStatus(401);
            } else {
                if (!password || JSON.stringify(password) === '{}') {
                    res.sendStatus(400);
                } else {
                    bcrypt.compare(password, existingUser.password, async (error, match) => {
                    if (error || !match) {
                        res.sendStatus(401);
                    } else {
                        const token = jwt.sign({ email: existingUser.email, _id: existingUser._id, roles: existingUser.roles }, key);
                        res.json({ token });
                    }
                });
            }
        }
    } catch (e) {
        next(e);
    }
});

router.use(errorHandler);

module.exports = router;
