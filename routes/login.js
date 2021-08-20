const { Router } = require("express");
const router = Router();

const jwt = require('jsonwebtoken');
const secret = 'KEQZOjws7PPb2pPoFIIn';


const bCrypt = require('bcrypt');

const userDAO = require('../daos/user');

const isLoggedIn = require("../Middleware/isAuthorized");
const errorReport = require("../Middleware/ErrorReport");

router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
    req.salt = await bCrypt.genSalt(10);
    console.log(`salt = [${req.salt}]`);
    next();
});

router.post("/signup", async (req, res, next) => {
  try {
    console.log(`Signing up = START`);
    const user = req.body;
    console.log(`user.password = [${user.password}]`);
    const hash = bCrypt.hash(user.password, req.salt);
    
    if (user.password == ''){
      throw new Error("Password is required");
    }

    user.password = (await hash).toString();

    const roles = ['user'];
    const userData = {email: user.email, password: user.password, roles: roles };
    let newUser = await userDAO.create(userData);
    res.json(newUser); 

  } catch(e) {
    next(e);
  }
});
  
router.use(async (req, res, next) => {  
  try {
    console.log(`Getting user by email address = START`);
    const user = req.body;

    if (user) 
    {
      const newUser = await userDAO.getByLogin(user.email);
      req.user = newUser;
    }
    next(); 
  } catch(e) {
    
    next(e);
  }
});


router.post("/", async (req, res, next) => { 
  try {
    console.log(`Logging in = START`);
    if (!req.user){
      throw new Error('User not found');
    }
    if (!req.body.password || !req.user.password){
      throw new Error('Password is required');
    }
    let compareSuccess = await bCrypt.compare(req.body.password, req.user.password);
    if (!compareSuccess) {
      console.log('Password match failed.')
      throw new Error('Password match failed');
    }
    const data  = { _id: req.user._id, email: req.user.email, roles: req.user.roles };
    let token = jwt.sign(data, secret);
    res.json({token});
  } catch (e) {
    next(e);
  }
});

  router.use(isLoggedIn);
  
  //Password change
  router.post("/password", async (req, res, next) => {
    try {
      console.log(`Change Password = START`);
      if (!req.tokenIsValid) { 
        throw new Error('Token is Invalid');
      }
      if (!req.body.password){
        throw new Error('Password is required');
      }

        const hash = bCrypt.hash(req.body.password, req.salt);
        const newPasswordHash = (await hash).toString();
        const data = { password: newPasswordHash}

        const isUpdated = await userDAO.updateById(req.user._id, data);  
        if (!isUpdated) {
          throw new Error("Password not Changed");
        }

        // Return a new token.  
        let token = jwt.sign(req.payload, secret);
        res.json({token});
    } catch (e) {
      next(e);
    }
  });
  
  router.use(errorReport); 
  
  module.exports = router;
