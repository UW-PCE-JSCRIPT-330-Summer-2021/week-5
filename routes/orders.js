const { Router } = require("express")
const router = Router()

const { isAuthorized } = require("../middleware/auth")
const orderDAO = require('../daos/order')

router.use(isAuthorized)

router.post("/", async (req, res, next) => {
    try {
        const userId = req.user._id;
        const items = req.body;
        const newOrder = await orderDAO.createOrder(userId, items);
        res.json(newOrder);
    } catch (e) {
        if (e.message.includes("create order failed")) {
            res.sendStatus(400)
        }
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const orderId = req.params.id;
        const user = req.user;
        const order = await orderDAO.getOrderById(user, orderId);
        res.json(order);
    } catch (e) {
        if (e.message.includes("get order failed")) {
            res.sendStatus(404);
        }
        next(e);
    }
});

router.get("/", async (req, res, next) => {
    try {
        const user = req.user;
        const userOrders = await orderDAO.getUserOrders(user);
        res.json(userOrders);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
