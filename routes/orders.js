const { Router } = require("express");
const router = Router();

// const jwt = require('jsonwebtoken');
// const secret = 'KEQZOjws7PPb2pPoFIIn';

const ordersDAO = require('../daos/order');
const itemsDAO = require('../daos/item');
const order = require("../models/order");

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
        const reqBody = req.body;
        console.log(reqBody);
        if (reqBody){
            const itemData = await itemsDAO.getByIds(reqBody);
            console.log(itemData)
            // if (itemData && itemData.length != 0){
            //     let total = 0;
            //     itemData.forEach((element) => {
            //         total += element.price;
            //     });
            if (itemData && itemData.length != 0){
                let total = 0;
                reqBody.forEach(idToAdd => { 
                    itemData.find((item) => {
                        if (item._id == idToAdd){
                            total += item.price;
                        }
                    });                    
                });
                // console.log(total);
                const orderData = {
                    userId: req.user._id,
                    items: reqBody,
                    total: total
                };
                console.log(orderData);

                const created = ordersDAO.create(orderData);
                res.json(created);
            } else {
                throw new BadDataError('Item not found');
            }
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
        // const orders = await ordersDAO.getByUserId(req.payload.userId);
        const orders = await ordersDAO.getAll();
        res.json(orders);
    } catch(e) {      
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        if (!req.tokenIsValid) { 
            throw new Error('Token is Invalid');
        }
        const orderId = req.params.id;
        const order = await ordersDAO.getById(orderId);
        if (!order) {
            throw new Error("Invalid order ID");
        }
        res.json(order);
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
        const orderData = {_id: req.params.id, title: req.body.title, price: req.body.price, }
        const success = await ordersDAO.updateById(orderData);
        if (!success) {
            throw new Error("Order not found");
        }
        res.json(success);
    } catch(e) {
        next(e);
    }
});

router.use(errorReport);


  
module.exports = router;
  
  
