const { Router } = require("express");
const router = Router({ mergeParams: true });


const userDAO = require("../dao/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'my_super_secret';
const isValid = require("../middleware/authen");



router.post("/signup", async (req, res, next) => {
    const user = req.body;
    if (!user) {
        res.status(400).send("User is not found");
        return;
    }
    if (!user.email) {
        res.status(400).send('Email is not found');
        return;
    }
    if (user.email.trim() === '') {
        res.status(400).send('email is empty');
        return;
    }
    if (!user.password) {
        res.status(400).send('Password is not found');
        return;
    }
    if (user.password.trim() === '') {
        res.status(400).send('Password is empty');
        return;
    }
    const email = user.email.trim();


    const confirmUser = await userDAO.getUser(email);


    if (confirmUser) {
        res.status(409).send('User already exists');
        return;
    }


    const textPassword = user.password.trim();
    let savedHash = await bcrypt.hash(textPassword, 12);




    const postedUser = await userDAO.createUser({
        email: email,
        password: savedHash,
        roles: ['user']
    });
    req.user = postedUser;
    res.status(200).send('pass');


});


router.post("/", async (req, res, next) => {
    let newUser = req.body;
    if (!newUser) {
        res.status(401).send("User not found");
        return;
    }


    let email = newUser.email;
    let userFromDataBase = await userDAO.getUser(email);


    if (!userFromDataBase) {
        res.status(401).send("User not found");
        return;
    }
    let passwd = newUser.password;
    if (!passwd) {
        res.status(400).send("Password not found");
        return;
    }
    psswd = passwd.trim();
    if (passwd === '') {
        res.status(400).send("Password is empty");
        return;
    }


    let result = await bcrypt.compare(passwd, userFromDataBase.password);
    if (!result) {
        res.status(401).send("Passwords don not match");
        return;
    }
    res.status(200);




    const data = {
        email: userFromDataBase.email,
        _id: userFromDataBase._id,
        roles: [...userFromDataBase.roles]
    }


    let token = await jwt.sign(data, secret);
    if (token) {
        req.body.token = token;
        res.json(req.body);
    }


});


router.post("/logout", async (req, res, next) => {


    res.status(404).send('user is required');
});






router.use(async (req, res, next) => {
    isValid(req, res, next);
});


router.post("/password", async (req, res, next) => {


    let password = req.body.password;
    if (!password) {
        res.status(400).send('password is required');
        return;
    }
    password = password.trim();

    if (password === '') {
        res.status(400).send('password is required');
        return;
    }
    let savedHash = await bcrypt.hash(password, 12);   
    const postedUser = await userDAO.updateUserPassword(req.user._id, savedHash);
    res.status(200).send('pass');
});

module.exports = router; 
