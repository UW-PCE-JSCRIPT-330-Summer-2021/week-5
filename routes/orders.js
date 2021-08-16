const { Router } = require("express");
const router = Router();
const orderDAO = require('../daos/order');
const itemDAO = require('../daos/item')
const { isAuthorized, isAdmin } = require('../middleware/auth');

router.get("/", isAuthorized, isAdmin, async (req, res) => {
  try {
    if (!req.isAdmin) {
      const order = await orderDAO.getOrderByUser(req.user._id);
      return res.json(order)
    } 
    if (req.isAdmin) {
      const allOrder = await orderDAO.getAll();
      return res.json(allOrder)
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

router.get("/:id", isAuthorized, isAdmin, async (req, res) => {
  try {
    const orderDetail = await orderDAO.getOrderById(req.params.id);
    if (req.isAdmin || req.user._id == orderDetail.userId) {
      return res.json(orderDetail)
    } else {
      return res.sendStatus(404)
    }
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

router.post("/", isAuthorized, async (req, res) => {
  try {
    let total = 0;
    const items = req.body;
    for (let i = 0; i < items.length; i++) {
      const item = await itemDAO.getItem(items[i]);
      if (!item) {
        return res.sendStatus(400)
      } else {
        total += item.price;
      }
    }
    const newOrder = await orderDAO.createOrder({ 
      userId: req.user._id, 
      items: req.body, 
      total: total 
    });
    res.json(newOrder);
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

module.exports = router;