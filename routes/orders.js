const { Router } = require("express");
const router = Router();
const { isAuthorized, isAdmin } = require('../middleware/auth');

const orderDAO = require('../daos/order');
const itemDAO = require('../daos/item');

router.use(isAuthorized);

// Create: `POST /orders` - open to all users
router.post('/', async (req, res, next) => {
  try {
    const items = req.body;  
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      const item = await itemDAO.getItemById(items[i]);
      if (!item) {
        return res.status(400).send("Bad item _id");
      } else {
        total += item.price;
      }
    }
    const order = await orderDAO.createOrder({ userId: req.user._id, items: items, total: total });
    res.json(order);
  } catch (e) {
    next(e);
  }
});

// Get my orders: `GET /orders` - return all the orders made by the user making the request
router.get('/', isAdmin, async (req, res, next) => {
  try {
    if (req.user.roles.includes('admin')) {
      const orders = await orderDAO.getAllOrders();
      res.status(200).send(orders);
    } else {
      const userOrder = await orderDAO.getUserOrder(req.user._id);
      res.json(userOrder);
    }
  } catch (e) {
    next(e);
  }
})
// Get an order: `GET /order/:id` - return an order with the `items` array containing the full item objects rather than just their _id.
router.get('/:id', isAdmin, async (req,res, next) => {
  try {
    const orderInfo = await orderDAO.getOrderById(req.params.id);
    if (orderInfo.userId == req.user._id || req.user.roles.includes('admin')) {
      res.json(orderInfo);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    next(e);
  }
})

module.exports = router;