const { Router } = require("express");
const router = Router();

const ordersDAO = require('../daos/order');
const itemsDAO = require('../daos/item');

const isLoggedIn = require("../Middleware/isAuthorized");
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
            if (itemData && itemData.length != 0){
                let total = 0;
                let items = [];
                reqBody.forEach(idToAdd => { 
                    itemData.find((item) => {
                        if (item._id == idToAdd){
                            items.push(item);
                            total += item.price;
                        }
                    });
                });
                if (reqBody.length != items.length) {
                    throw new Error('item not found')
                }
                const orderData = {
                    userId: req.user._id,
                    items: items,
                    total: total
                };
                console.log(orderData);

                const created = await ordersDAO.create(orderData);
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
        if (req.isAdmin) {
            const orders = await ordersDAO.getAll();
            res.json(orders);
        } else {
            const orders = await ordersDAO.getAllByUserId(req.user._id);
            res.json(orders);
        }
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
        console.log(orderId);
        const order = await ordersDAO.getById(orderId);
        if (!order) {
            throw new Error("Invalid order ID");
        }

        if (!req.isAdmin){
            console.log(`(order.userId = ${order.userId} AND req.user._id = ${req.user._id}`)
            if (order.userId.toString() !== req.user._id.toString()) {
                throw new Error("Invalid order ID");
            }
        }
        
        res.json(order);
    } catch(e) {      
        next(e);
    }
});

router.use(errorReport);

module.exports = router;
  
  
