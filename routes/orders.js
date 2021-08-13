const { Router } = require('express');
const router = Router();
const orderDAO = require('../daos/order');
const itemDAO = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/authentication');

// - Orders (requires authentication)
//   - Create: `POST /orders` - open to all users
//     - Takes an array of item _id values (repeat values can appear). Order should be created with a `total` field with the total cost of all the items from the time the order is placed (as the item prices could change). The order should also have the `userId` of the user placing the order. 
//   - Get my orders: `GET /orders` - return all the orders made by the user making the request
//   - Get an order: `GET /order/:id` - return an order with the `items` array containing the full item objects rather than just their _id. If the user is a normal user return a 404 if they did not place the order. An admin user should be able to get any order.

router.use(isAuthorized);

router.get("/", isAdmin, async (req, res, next) => {
    try {
        if (req.userInfo.roles.includes("admin")) {
            const orders = await orderDAO.getOrder();
            res.status(200).send(orders);
        } else {
            const userOrder = await orderDAO.getOrderByUser(req.user._id);
            res.json(userOrder);
        }
    } catch (e) {
        next (e)
    }
});

router.get("/:id", isAdmin, async (req, res, next) => {
    try {
        const userId = req.userInfo._id;
        const orderId = req.params.id;
        const order = await orderDAO.getOrderById(orderId);
        if (req.isAdmin || userId == order.userId) {
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        next(e)
    }
});

router.post("/", isAuthorized, async (req, res, next) => {
    try {
        let total = 0;
        for (let index = 0; index < req.body.length; index++) {
            const item = await itemDAO.getItemById(req.body[index]);
            if (!item) {
                res.sendStatus(400);
            } else {
                total += item.price;
            }
        }
        const createdNewOrder = await orderDAO.createOrder({
            userId: req.userInfo._id,
            items: req.body,
            total: total
        });
        res.json(createdNewOrder);
    } catch (e) {
        next(e)
    }
});

module.exports = router;