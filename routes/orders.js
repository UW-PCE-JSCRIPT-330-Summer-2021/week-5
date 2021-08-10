const { Router } = require('express');
const router = Router();

const { isAuthorized } = require('../middleware/auth');

const itemDAO = require('../daos/item');
const orderDAO = require('../daos/order');

router.use(isAuthorized);

//Create: POST /orders - open to all users
router.post("/", async (req, res, next) => {
    const userId = req.user._id;
    const items = req.body;
    const total = await itemDAO.calculateSum(items);
    if (!total) {
        res.sendStatus(400);
    } else {
        try {
            const newOrder = await orderDAO.create(userId, items, total);
            if (newOrder) {
                res.json(newOrder);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.sendStatus(404)
        }
    }
});


//Get my orders: GET /orders - return all orders made by the user making the request
router.get("/", async (req, res, next) => {
    if (req.user.roles.includes('admin') == true) {
        //gets all orders *requires admin*
        const allOrders = await orderDAO.getAll();
        if (allOrders) {
            res.json(allOrders);
        } else {
            res.sendStatus(404);
        }
    } else {
        //gets order of the user
        const userId = req.user._id;
        const userOrders = await orderDAO.getAllByUserId(userId);
        if (userOrders) {
            res.json(userOrders)
        } else {
            res.sendStatus(404);
        }
    }
});


//Get an order: GET /order/:id
router.get("/:id", async (req, res, next) => {
    const orderId = req.params.id;
    if (req.user.roles.includes('admin') == true) {
        const order = await orderDAO.getById(orderId);
        if (order) {
            res.json(order);
        } else {
            res.status(404).send("Order not found");
        }
    } else {
        const userId = req.user._id;
        const orderUserId = await orderDAO.getUserforId(orderId);
        if (userId == orderUserId) {
            const order = await orderDAO.getById(orderId);
            if (order) {
                res.json(order);
            } else {
                res.status(404).send("Order not found");
            }
        } else {
            res.sendStatus(404);
        }
    }
});

module.exports = router;