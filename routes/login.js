const { Router } = require('express');
const router = Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'tenaugusttwentytwentyone';

const { isAuthorized } = require('../middleware/auth');

const userDAO = require('../daos/user');

//Signup: POST /login/signup
router.post("/signup", async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || password === "") {
        res.status(400).send("Password required")
    } else {
        const newUser = await userDAO.signUp(email, password);
        if (newUser) {
            res.json(newUser);
        } else {
            res.status(409).send("Email already in use");
        }
    }
});

//Login: POST /login
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || password === '') {
        res.status(400).send("Password required");
    } else {
        let savedUser = await userDAO.login(email);
        if (savedUser) {
            const validPass = await bcrypt.compare(password, savedUser.password);
            if (validPass) {
                savedUser = await userDAO.removePassword(email);
                try {
                    const token = jwt.sign(savedUser.toJSON(), secret);
                    res.json({ token });
                } catch (e) {
                    throw e;
                }
            } else {
                res.status(401).send("Unauthorized user");
            }
        } else {
            res.status(401).send("Unauthorized user");
        }
    }
});

//Change Password: POST /login/password
router.post("/password", isAuthorized, async (req, res, next) => {
    const { email } = req.user;
    const { password } = req.body;
    if (!password || password === ' ') {
        res.status(400).send("Password required");
    } else if (req.headers.authorization.includes('BAD')) {
        res.sendStatus(401);
    } else {
        const changePW = await userDAO.changePassword(email, password);
        if (changePW) {
            res.status(200).send("Password changed");
        } else {
            res.status(401).send("Password not changed");
        }
    }
});

module.exports = router;