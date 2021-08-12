const { Router } = require('express');
const router = Router();

const { isAuthorized, isAdmin } = require('../middleware/auth');
const { errorHandler } = require('../middleware/error');

const orderDao = require('../daos/order');
const itemDao = require('../daos/item');

// Create: POST /orders - open to all users
router.post("/", isAuthorized, async (req, res, next) => {
  try {
    let totalPrice = 0;
    for (let i = 0; i < req.body.length; i++) {
      let thisItem = await itemDao.getItem(req.body[i]);
      if (!thisItem) {
        return res.status(400).send("Invalid item ID");
      } else {
        totalPrice += thisItem.price;
      }
    }
    const createdOrder = await orderDao.createOrder({ userId: req.userInfo._id, items: req.body, total: totalPrice });
    res.json(createdOrder);
  } catch (e) {
    next(e);
  }
});

// Get my orders: GET /orders - return all the orders made by the user making the request
router.get("/", isAuthorized, isAdmin, async (req, res, next) => {
  try {
    if (req.isAdmin) {
      const allOrders = await orderDao.getAll();
      res.json(allOrders);
    } else {
      const userOrders = await orderDao.getUserOrders(req.userInfo._id);
      res.json(userOrders);
    }
  } catch (e) {
    next(e);
  }
});

// Get an order: GET /order/:id - return an order with the items array containing the full item objects rather than just their _id.
// If the user is a normal user return a 404 if they did not place the order. An admin user should be able to get any order.
router.get("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  try {
    const thisOrder = await orderDao.getOrderById(req.params.id);
    if (req.isAdmin || req.userInfo._id == thisOrder.userId) {
      res.json(thisOrder);
    } else {
      res.status(404).send('Not Found');
    }
  } catch (e) {
    next(e);
  }
});

// Error handling middleware
router.use(errorHandler);

module.exports = router;
