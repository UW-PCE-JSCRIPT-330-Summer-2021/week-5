const { Router } = require("express");
const router = Router();

const orderDAO = require('../daos/order');
const itemDAO = require('../daos/item')
const { isAllowed, isAdmin } = require('../middlewares/auth');
const { errorHandler } = require('../middlewares/error');

// return all orders made by user
router.get("/", isAllowed, isAdmin, async (req, res, next) => {
    try {
        if (req.isAdmin) {
            const allOrdersPlaced = await orderDAO.getAll();
            res.json(allOrdersPlaced);
        } else {
            const ordersByUser = await orderDAO.getOrderByUser(req.userInfo._id);
            res.json(ordersByUser);
        }
    } catch (e) {
        next(e);
    }
});
  
// reading unique order
router.get("/:id", isAllowed, isAdmin, async (req, res, next) => {
    try {
        if (req.isAdmin) {
            const orderData = await orderDAO.getOrderById(req.params.id);
            if (!orderData) {
                res.sendStatus(400);
            } res.json(orderData);
        } else {
            const userOrder = await orderDAO.getByUserId(req.userInfo._id, orderId);
            if (!userOrder) {
                res.sendStatus(404);
            } else {
            res.json(userOrder);
        }
    }
    } catch (e) {
        next(e);
    }
});

// creating order
router.post("/", isAllowed, async (req, res, next) => {
    try {
        let sum = 0;
        let itemId = req.body;
        for (let i = 0; i < itemId.length; i++) {
            const getItem = await itemDAO.getItem(itemId[i]);
            if (!getItem) {
                return res.sendStatus(400);
            } else {
                sum += getItem.price;
            }
        }
        const createOrder = await orderDAO.createOrder({ userId: req.userInfo._id, items: itemId, total: sum });
        res.json(createOrder).sendStatus(200);
    } catch (e) {
        next(e);
    }
});

router.use(errorHandler);

module.exports = router;
