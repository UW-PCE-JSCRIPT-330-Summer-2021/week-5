const { Router } = require("express");
const router = Router({ mergeParams: true });


const userDAO = require("../daos/user");
const orderDAO = require("../daos/orders");
const itemrDAO = require("../daos/item");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'my_super_secret';
const isValid = require("../middleware/authentication");
const isAdmin = require("../middleware/authorization");

router.use(async (req, res, next) => {
    isValid(req, res, next);
   
});

// POST /orders - open to all users

router.post("/", async (req, res, next) => {
    const userId = req.user._id;
    const itemIds = req.body;
    if (!itemIds) {
        res.sendStatus(404).send("Items not found");
        return;
    }
    try {
        const postedOrders = await orderDAO.createOrder(itemIds, userId);
        if (!postedOrders) {
            res.sendStatus(404).send("Order not found");
            return;
        }
        res.json(postedOrders);
      } catch (e) {
        next(e);
      }
    
});

// GET /orders - return all the orders made by the user making the request

router.get("/", async (req, res, next) => {
    if(!isAdmin((req.user.roles))){
        const orderForUser = await orderDAO.getOrderByUserId( req.user._id);
        if(!orderForUser){
            res.status(400).send('not found');         
        }
        res.json(orderForUser);
    } else {
        const ordersForAdming= await orderDAO.getOrders();
        if(!ordersForAdming){
            res.status(400).send('not found');         
        }
        res.json(ordersForAdming);
    }
});
// GET /order/:id - return an order with the items array containing the full item objects

router.get("/:id", async (req, res, next) => {

    let orderId = req.params.id;
    if(isAdmin((req.user.roles))){
        const orderForAdmin = await orderDAO.getOrderById( orderId);
        if(!orderForAdmin){
            res.status(400).send('not found');         
        }
        res.json(orderForAdmin);
    } else {
        const order = await orderDAO.getByOrderIdUserId(req.user._id, orderId);
        if (!order) {
            res.sendStatus(404);
            return;
        } else {
            res.json(order);
        }
    }
    
});


router.use(function (err, req, res, next) {
    if (err.message.includes("Not found")) {
      res.status(400).send("Invalid id provided");
    } else if (err.message.includes("Item for user not found")) { 
      res.status(404).send("Object not found");
    } else {
      res.status(500).send("Server error");
    }
  });

module.exports = router;