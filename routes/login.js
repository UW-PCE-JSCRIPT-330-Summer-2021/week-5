const { Router } = require("express");
const router = Router({ mergeParams: true });


const userDAO = require("../daos/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'my_super_secret';
const isValid = require("../middleware/authentication");



// Signup: POST /login/signup

router.post("/signup", async (req, res, next) => {
    const user = req.body;
    if (!user) {
        res.status(400).send("User not found");
        return;
    }
    if (!user.email) {
        res.status(400).send('Email not found');
        return;
    }
    if (user.email.trim() === '') {
        res.status(400).send('Empty email');
        return;
    }
    if (!user.password) {
        res.status(400).send('Password not found');
        return;
    }
    if (user.password.trim() === '') {
        res.status(400).send('Empty Password');
        return;
    }
    const email = user.email.trim();

    const checkUser = await userDAO.getUser(email);

    if (checkUser) {
        res.status(409).send('User is already exists');
        return;
    }

    const textPassword = user.password.trim();
    let savedHash = await bcrypt.hash(textPassword, 10);

  
    const postedUser = await userDAO.createUser({
        email: email,
        password: savedHash,
        roles: ['user']
    });
    req.user = postedUser;
    res.status(200).send('Ok');

});

// Login: POST /login
router.post("/", async (req, res, next) => {
    let incomingUser = req.body;
    if (!incomingUser) {
        res.status(401).send("User not found");
        return;
    }

    let email = incomingUser.email;
    let userFromDB = await userDAO.getUser(email);

    if (!userFromDB) {
        res.status(401).send("User not found");
        return;
    }
    let pswd = incomingUser.password;
    if (!pswd) {
        res.status(400).send("Password not found");
        return;
    }
    pswd = pswd.trim();
    if (pswd === '') {
        res.status(400).send("Password empty");
        return;
    }

    let result = await bcrypt.compare(pswd, userFromDB.password);
    if (!result) {
        res.status(401).send("Passwords not match");
        return;
    }
    res.status(200);


    const data = {
        email: userFromDB.email,
        _id: userFromDB._id,
        roles: [...userFromDB.roles]
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

//   Change Password POST /login/password
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
    let savedHash = await bcrypt.hash(password, 10);   
    const postedUser = await userDAO.updateUserPassword(req.user._id, savedHash);
    res.status(200).send('Ok');
});


module.exports = router;