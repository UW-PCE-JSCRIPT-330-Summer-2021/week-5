const { Router } = require('express');
const router = Router();

require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const auth = require('../middleware/auth');
const errorHandler = require('../middleware/error');

const userDAO = require('../daos/user');

router.post('/signup', async (req, res, next) => {
    try {
        const user = req.body;
        const existingUser = await userDAO.getUserByEmail(user.email);

        if(!existingUser) {
            if(!user.password || user.password.length === 0) {
                throw new Error('Password is required');
            } else {
                const newUser = await userDAO.createUser(user);
                res.json(newUser);
            }
        } else {
            throw new Error('User is a duplicate');
        }
    } catch(e) {
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const user = req.body;
        const existingUser = await userDAO.getUserByEmail(user.email);

        if(!existingUser) {
            throw new Error('User not found');
        } else {
            if(!user.password || user.password.length === 0) {
                throw new Error('Password is required');
            } else {
                const pwdMatch = await bcrypt.compare(user.password, existingUser.password);

                if(pwdMatch) {
                    const partialUser = {
                        _id: existingUser._id,
                        email: existingUser.email,
                        roles: existingUser.roles
                    }
                    const tokenStr = jwt.sign(partialUser, process.env.JWT_SECRET);
                    res.json({token: tokenStr});
                } else {
                    throw new Error('Passwords do not match');
                }
            }
        }
    } catch(e) {
        next(e);
    }
});

router.post('/password', auth.isAuthenticated, async (req, res, next) => {
    try {
        const existingUser = await userDAO.getUserByEmail(req.user.email);

        if(!existingUser) {
            throw new Error('User not found');
        } else {
            if(!req.body.password || req.body.password.length === 0) {
                throw new Error('Password is required');
            } else {
                const updatedUser = await userDAO.updateUserById(existingUser._id, req.body.password);
                res.json(updatedUser);
            }
        }
    } catch(e) {
        next(e);
    }
});

router.post('/logout', auth.isAuthenticated, async (req, res, next) => {
    next();
});

router.use(errorHandler);

module.exports = router;