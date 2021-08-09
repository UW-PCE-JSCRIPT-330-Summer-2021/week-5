const { Router } = require("express");
const router = Router();

const jwt = require('jsonwebtoken');
const secret = 'KEQZOjws7PPb2pPoFIIn';


const bCrypt = require('bcrypt');

const userDAO = require('../daos/user');
const user = require("../models/user");

// const tokenDAO = require('../daos/token');
// const token = require("../models/token");

const isLoggedIn = require("../middleware/IsLoggedIn");
const errorReport = require("../middleware/ErrorReport");

router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
    req.salt = await bCrypt.genSalt(10);
    console.log(`salt = [${req.salt}]`);
    next();
});


//create
router.post("/signup", async (req, res, next) => {
  try {
    console.log(`Signing up = START`);
    const user = req.body;

    // if (!req.body.email){
    //   throw new Error('Email is required');
    // }
    // if (!req.body.password){
    //   throw new Error('Password is required');
    // }
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


// Login using email and password  
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

    // user record in req.user
    const data  = { _id: req.user._id, email: req.user.email, roles: req.user.roles };
    let token = jwt.sign(data, secret);
    res.json({token});
    // const newToken = await tokenDAO.getTokenForUserId(req.user._id);
    // console.log(newToken);
    // if (newToken) {
    //   res.json(newToken);
    // } else {
    //   next();
    // }
  } catch (e) {
    next(e);
  }
});

  // router.use(async (req, res, next) => {
  //   try {
      // const AuthHeader = req.headers.authorization;
      // if (AuthHeader) {
      //   if (typeof(AuthHeader !== 'undefined')){
      //     const auth = AuthHeader.split(' ');
      //     req.token = auth[1];
      //   }

      //   console.log('req.token = ' + req.token)
      //   req.user = await tokenDAO.getUserIdFromToken(req.token);
        
        // req.tokenIsValid = jwt.verify(req.token, secret);
        // if (req.tokenIsValid){
          // const decoded = jwt.decode(req.token);

          // req.payload = decoded;
        // }
  //     }
  //     next();
  //   } catch (e) {
  //     next(e);
  //   }
  // });

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