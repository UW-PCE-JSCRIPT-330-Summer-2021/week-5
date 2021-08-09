const { Router } = require("express");
const router = Router();
const itemDAO = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/auth');
const { errorHandler } = require('../middleware/error');

router.use(isAuthorized);

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const item = await itemDAO.getItem(id);
    if (!item) {
      res.sendStatus(404);
    } else {
      res.json(item);
    }
  } catch (e) {
    next (e);
  }
});

// Get all items: GET /items - open to all users
router.get("/", async (req, res, next) => {
  try {
    const items = await itemDAO.getItems();
    res.json(items);
  } catch (e) {
    next (e);
  }
});

// Create: POST /items - restricted to users with the "admin" role
router.post("/", isAdmin, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      res.sendStatus(403);
    } else {
      const savedItem = await itemDAO.createItem(req.body);
      res.json(savedItem);
    }
  } catch (e) {
    next (e);
  }
});

// Update a note: PUT /items/:id - restricted to users with the "admin" role
router.put("/:id", isAdmin, async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      res.sendStatus(403);
    } else {
      const updatedItem = await itemDAO.updateItem(req.params.id, req.body);
      res.json(updatedItem);
    }
  } catch (e) {
    next (e);
  }
});

router.use(errorHandler);

module.exports = router;