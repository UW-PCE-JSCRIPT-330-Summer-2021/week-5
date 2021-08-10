const { Router } = require("express");
const router = Router();

const orderDAO = require("../daos/order");
const itemDAO = require("../daos/item");
const { isAuthorized, isAdmin } = require("../middlewares/auth");
const { errorHandler } = require("../middlewares/error");

// Read all orders
router.get("/", isAuthorized, isAdmin, async (req, res, next) => {
  try {
    if (req.isAdmin) {
      const allOrder = await orderDAO.getAll();
      res.json(allOrder);
    } else {
      const userOrder = await orderDAO.getOrderByUser(req.userInfo._id);
      res.json(userOrder);
    }
  } catch (e) {
    next(e);
  }
});

// Read single order
router.get("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  try {
    const orderDetail = await orderDAO.getOrderById(req.params.id);
    if (req.isAdmin || req.userInfo._id == orderDetail.userId) {
      res.json(orderDetail);
    } else {
      res.status(404).send("Not Found");
    }
  } catch (e) {
    next(e);
  }
});

// Create order
router.post("/", isAuthorized, async (req, res, next) => {
  try {
    let total = 0;
    for (let index = 0; index < req.body.length; index++) {
      const item = await itemDAO.getItem(req.body[index]);
      if (!item) {
        return res.status(400).send("Bad request - Incorrect item ID");
      } else {
        total += item.price;
      }
    }
    const newOrder = await orderDAO.createOrder({
      userId: req.userInfo._id,
      items: req.body,
      total: total,
    });
    res.json(newOrder);
  } catch (e) {
    next(e);
  }
});

// Error handle middleware
router.use(errorHandler);

module.exports = router;
