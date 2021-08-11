const { Router } = require("express");
const router = Router();
const orderDAO = require('../daos/order');
const itemDAO = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/auth');
const { errorHandler } = require('../middleware/error');

router.use(isAuthorized);

// Get my orders: GET /orders - return all the orders made by the user making the request
router.get("/", isAdmin, async (req, res, next) => {
  try {
    if (req.user.isAdmin) {
      const orders = await orderDAO.getAllOrders();
      res.json(orders);
    } else {
      const ordersByUser = await orderDAO.getOrderByUserId(req.user._id);
      res.json(ordersByUser);
    }
  } catch (e) {
    next (e)
  }
});

// Get an order: GET /order/:id - return an order with the items array 
// containing the full item objects rather than just their _id. 
// If the user is a normal user return a 404 if they did not place the order. 
// An admin user should be able to get any order.
router.get("/:id", isAdmin, async (req, res, next) => {
  try {
    let orderId = req.params.id;
    const order = await orderDAO.getOrderByOrderId(orderId);
    if (req.user.isAdmin || order.userId == req.user._id) {
      res.json(order);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    next (e)
  }
});

// Create: POST /orders - open to all users
// Takes an array of item _id values (repeat values can appear). 
// Order should be created with a total field with the total cost of all the items 
// from the time the order is placed (as the item prices could change). 
// The order should also have the userId of the user placing the order.
router.post("/", async (req, res, next) => {
  try {
    const itemIds = req.body;
    let total = 0;
    for (let i = 0; i < itemIds.length; i++) {
      const item = await itemDAO.getItem(itemIds[i]); 
      if (!item) {
        res.sendStatus(400);
      } else {
        total += item.price;
      }
    }
    const order = await orderDAO.createOrder({ items: itemIds, total: total, userId: req.user._id });
    res.json(order);
  } catch (e) {
    next (e)
  }
});

router.use(errorHandler);

module.exports = router;