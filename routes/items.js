const { Router } = require('express');
const router = Router();

const itemDao = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/auth');
const { errorHandler } = require('../middleware/error');

// Create: POST /items - restricted to users with the "admin" role
router.post("/", isAuthorized, isAdmin, async (req, res, next) => {
  try {
    if (req.isAdmin) {
      const itemCreated = await itemDao.createItem(req.body);
      res.json(itemCreated);
    } else {
      res.status(403).send("User is not an admin");
    }
  } catch (e) {
    next(e);
  }
});

// Update an item: PUT /items/:id - restricted to users with the "admin" role
router.put("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  try {
    if (req.isAdmin) {
      const itemUpdated = await itemDao.updateItem(req.params.id, req.body);
      if (itemUpdated) {
        res.sendStatus(200);
      }
    } else {
      res.status(403).send("User is not an admin");
    }
  } catch (e) {
    next(e);
  }
});

// Get all items: GET /items - open to all users
router.get("/", isAuthorized, async (req, res, next) => {
  try {
    const allItems = await itemDao.getAll();
    res.json(allItems);
  } catch (e) {
    next(e);
  }
});

// Get an item: GET /items/:id - open to all users
router.get("/:id", isAuthorized, async (req, res, next) => {
  try {
    const oneItem = await itemDao.getItem(req.params.id);
    res.json(oneItem);
  } catch (e) {
    next(e);
  }
});

// Error handling middleware
router.use(errorHandler);

module.exports = router;
