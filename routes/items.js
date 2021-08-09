const { Router } = require("express");
const router = Router();

// const jwt = require('jsonwebtoken');
// const secret = 'KEQZOjws7PPb2pPoFIIn';

const itemsDAO = require('../daos/item');
const item = require("../models/item");

const isLoggedIn = require("../middleware/IsLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const errorReport = require("../middleware/ErrorReport");

router.use(async (req, res, next) => {
    console.log(`${req.method} ${req.url} at ${new Date()}`);
    next();
  });

router.use(isLoggedIn);
router.use(isAdmin);

router.post("/", async (req, res, next) => {
    try {        
        if (!req.isAdmin) { 
            throw new Error('Not an Admin');
        }
        const reqBody = req.body;
        console.log(reqBody);
        if (reqBody){
            const newItem = await itemsDAO.create(reqBody);
            res.json(newItem); 
        } else {
            next();
        }
    } catch(e) {      
      next(e);
    }
  });

 router.get("/", async (req, res, next) => {
    try {
        if (!req.tokenIsValid) { 
            throw new Error('Token is Invalid');
        }
        // const items = await itemsDAO.getByUserId(req.payload.userId);
        const items = await itemsDAO.getAll();
        res.json(items);
    } catch(e) {      
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        if (!req.tokenIsValid) { 
            throw new Error('Token is Invalid');
        }
        const itemId = req.params.id;
        const item = await itemsDAO.getById(itemId);
        if (!item) {
            throw new Error("Invalid item ID");
        }
        res.json(item);
    } catch(e) {      
        next(e);
    }
});


// Update
router.put("/:id", async (req, res, next) => { 
    try  {
        if (!req.isAdmin) { 
            throw new Error('Not an Admin');
        }
        const itemData = {_id: req.params.id, title: req.body.title, price: req.body.price, }
        const success = await itemsDAO.updateById(itemData);
        if (!success) {
            throw new Error("Item not found");
        }
        res.json(success);
    } catch(e) {
        next(e);
    }
});

router.use(errorReport);


  
module.exports = router;
  
  
