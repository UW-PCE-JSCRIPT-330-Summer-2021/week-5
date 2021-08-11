const { Router } = require("express")
const router = Router();

//uses bcrypt for password encryption
const bcrypt = require("bcrypt");
//use jwt for encryption as well
const jwt = require("jsonwebtoken");
//secretkey for jwt
const SECRETKEY = "redrover123";

const userDAO = require('../daos/user');
const { isAuthorized } = require('../middleware/authorization');
const { errorHandler } = require('../middleware/errorHandler');

//Signup: POST/signup
//allows a user to signup
router.post("/signup", async (req, res, next) => {
    //email and password is accessed from the body of the request
    const { email, password } = req.body;

    //check to see if user did not enter a password or an email, or password box is empty
    if (!password || !email || password === '') {
        //should send 400
        res.sendStatus(400);
    }
    //else if password and email is not empty
    else {
    try {
        //get the user's email using the user DAO
        const user = await userDAO.getUser(email);
        if (user) {
            //should return a 409 with a repeat signup
            res.sendStatus(409);
        }
        //else, create an encrypted password for the user using the email they provided
        else {
            //bcrypt.hash encrypts the password string entered by the user
            const encryptedPass = await bcrypt.hash(password, 10);
            //user's info is email and encrypted version of their password
            const newUser = ({ email, password: encryptedPass });
            //creates the user based on new info
            let madeUser = await userDAO.createUser(newUser);
            //created user with new info is now an object
            madeUser = madeUser.toObject();
            //delete the password of the create user with a new info (which is now an object)
            delete madeUser.password;
            //should send 200 and create the new user
            res.json(madeUser);
        }
    }
    catch (e) {
        next(e);
    }
    }
});

//Login: POST/
//allows a user to login with their proper credentials
router.post("/", async (req, res, next) => {
     //email and password is accessed from the body of the request
    const { email, password } = req.body;

     //check if login email exists or is empty
     if (!email || email === '') {
         //should send 401
         res.sendStatus(401);
     }
     else {
         try {
             //get user's email using the user DAO
             const user = await userDAO.getUser(email);
             //checks if user actually exists
             if (!user) {
                 //should send 401, password doesn't match
                 res.sendStatus(401);
             }
             else {
                 //checks to see if a password has been entered or is empty
                 if (!password || password === '') {
                     //should send 400, password isn't provided
                     res.sendStatus(400);
                 }
                 else {
                     //hash incoming password, and compare it to the stored hash
                     bcrypt.compare(password, user.password, async (error, result) => {
                         //if an error pops up or no result comes up
                         //hashes don't match, entered password was wrong
                         if (error || !result) {
                             //should send 401
                             res.sendStatus(401);
                         }
                         //hashes match, entered password was correct
                         else {
                             //gives a token to that user
                             //token is given using jwt
                             //once user is logged in, user is allowed to access routes, services, and resources from the token
                             const token = jwt.sign({ email: user.email, _id: user._id, roles: user.roles}, SECRETKEY);
                             //should return jwt with user email, id, and roles inside, but not password
                             res.json({ token });
                         }
                     });
                 }
             }
         }
         catch (e) {
             next(e);
         }
     }
     
 });

//Change Password: POST/password
//allows a user to change their password
//isAuthorized: checks to see if user has authorization
router.post("/password", isAuthorized, async (req, res, next) => {
    //password is the password portion of the body
    const password = req.body.password;

    //check to see if password is entered or empty
    if (!password || password === '') {
        //should send 400; reject empty password
        res.sendStatus(400);
    }
    //else, there is a password entered
    else {
        try {
            //encrypts the user's entered password
            const encryptedPass = await bcrypt.hash(password, 10);
            //updates the user's password with the new encrypted password
            const updateUserPass = await userDAO.updateUserPassword(req.userInfo._id, encryptedPass);
            //should send 200 if password changed for user
            //should send 400 if password failed to change
            res.sendStatus(updateUserPass ? 200 : 400);
        }
        
        catch (e) {
            //something did not work properly, send 500
            res.status(500).send(e.message);
        }
    }
});

//error handling middleware
router.use(errorHandler);

module.exports = router;