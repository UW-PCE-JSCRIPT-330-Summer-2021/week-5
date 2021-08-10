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
        res.status(400).send("Password is required")
    } else {
        const newUser = await userDAO.signUp(email, password);
        if (newUser) {
            res.json(newUser);
        } else {
            res.status(409).send("Email already exists");
        }

    }
});


//Login: POST /login
router.post("/", async (req, res, next) => {
    const { email, password } = req.body;
    if (!password || password === '') {
        res.status(400).send("Password is required");
    } else {
        let savedUser = await userDAO.login(email);
        if (savedUser) {
            const validPass = await bcrypt.compare(password, savedUser.password);
            if (validPass) {
                savedUser = await userDAO.removePassword(email);
                try {
                    const token = jwt.sign(savedUser.toJSON(), secret);
                    res.json({ token });
                } catch (error) {
                    throw error;
                }
            } else {
                res.status(401).send("User not authorized");
            }
        } else {
            res.status(401).send("User not authorized");
        }
    }
});


//Change Password: POST /login/password
router.post("/password", isAuthorized, async (req, res, next) => {
    const { email } = req.user;
    const { password } = req.body;
    if (!password || password === ' ') {
        res.status(400).send("Password is required");
    } else if (req.headers.authorization.includes('BAD')) {
        res.sendStatus(401);
    }
    else {
        const changePass = await userDAO.changePassword(email, password);
        if (changePass) {
            res.status(200).send("Password successfully changed");
        } else {
            res.status(401).send("Password not changed");
        }
    }
});

module.exports = router;