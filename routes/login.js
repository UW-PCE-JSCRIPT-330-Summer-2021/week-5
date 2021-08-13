const { Router } = require('express');
const router = Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const userDAO = require('../daos/user');
const { isAuthorized } = require('../middleware/authentication');

// - Login
//   - Signup: `POST /login/signup`
//   - Login: `POST /login`
//   - Change Password `POST /login/password`

router.use(isAuthorized);

router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || email.length === 0) {
        res.status(400).send("Email address required")
    } else {
        if (!password || password === '') {
            res.status(400).send("Password required")
        } try {
            const emailLogin = await userDAO.getUser(email);
            if (emailLogin) {
                res.sendStatus(409);
            } else {
                const encryptedPassword = await bcrypt.hash(password, 10);
                const newUser = ({ email, password: encryptedPassword });
                const createdUser = await userDAO.createUser(newUser);
                createdUser = createdUser.toObject();
                delete userDAO.createUser.password;
                res.json(createdUser);
            }
        } catch (e) {
            next(e)
        }
    }
});

router.post("/password", isAuthorized, async (req, res, next) => {
    const password = req.body;
    if (!password || password === '') {
        res.status(400);
    } else {
        try {
            const encryptedPassword = await bcrypt.hash(password, 10);
            const successfulLogin = await userDAO.updatePassword(req.userInfo._id, encryptedPassword);
            res.sendStatus(successfulLogin ? 200 : 400);
        } catch (e) {
            res.status(500).send(e.message);
        }
    }
});

router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || email === '') {
        res.sendStatus(401);
    } else {
        try {
            const user = await userDAO.getUser(email);
            if (!user) {
                res.sendStatus(401);
            } else {
                if (!password || password === '') {
                    res.sendStatus(400);
                } else {
                    bcrypt.compare(password, user.password, async (error, result) => {
                        if (error || !result) {
                            res.sendStatus(401);
                        } else {
                            const token = jwt.sign({ email: user.email, _id: user._id, roles: user.roles },
                                secretKey);
                                res.json({ token })
                        }
                    })
                }
            }
        } catch (e) {
            next(e)
        }
    } 
});

module.exports = router;