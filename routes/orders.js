const { Router } = require("express");
const router = Router({ mergeParams: true });




const userDAO = require("../dao/user");
const orderDAO = require("../dao/orders");
const itemrDAO = require("../dao/item");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'my_super_secret';
const isValid = require("../middleware/authen");
const isAdmin = require("../middleware/author");


router.use(async (req, res, next) => {
    isValid(req, res, next);


});



router.post("/", async (req, res, next) => {
    const userId = req.user._id;
    const itemsId = req.body;
    if (!itemsId) {
        res.sendStatus(404).send("Items not found");
        return;
    }
    try {
        const postedOrders = await orderDAO.createOrder(itemsId, userId);
        if (!postedOrders) {
            res.sendStatus(404).send("Order not found");
            return;
        }
        res.json(postedOrders);
      } catch (e) {
        next(e);
      }


});

router.get("/", async (req, res, next) => {
    if(!isAdmin((req.user.roles))){
        const userOrder = await orderDAO.getOrderByUserId( req.user._id);
        if(!userOrder){
            res.status(400).send('order not found');         
        }
        res.json(userOrder);
    } else {
        const adminOrder= await orderDAO.getOrders();
        if(!adminOrder){
            res.status(400).send('order not found');         
        }
        res.json(adminOrder);
    }
});

router.get("/:id", async (req, res, next) => {


    let orderId = req.params.id;
    if(isAdmin((req.user.roles))){
        const adminsOrder = await orderDAO.getOrderById( orderId);
        if(!adminsOrder){
            res.status(400).send('order not found');         
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
    if (err.message("Not found")) {
      res.status(400).send("id provided is not");
    } else if (err.message( "user Item not found")) { 
      res.status(404).send(" not found");
    } else {
      res.status(500).send("Server error");
    }
  });
module.exports = router; 