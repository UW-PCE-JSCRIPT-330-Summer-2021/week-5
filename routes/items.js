const { Router } = require("express");
const router = Router();

const itemDAO = require("../daos/item");
const { isAuthorized, isAdmin } = require("../middlewares/auth");
const { errorHandler } = require("../middlewares/error");

// Read all items
router.get("/", isAuthorized, async (req, res, next) => {
  try {
    const savedItems = await itemDAO.getAll();
    res.json(savedItems);
  } catch (e) {
    next(e);
  }
});

// Read single item
router.get("/:id", isAuthorized, async (req, res, next) => {
  try {
    const savedItem = await itemDAO.getItem(req.params.id);
    res.json(savedItem);
  } catch (e) {
    next(e);
  }
});

// Create item
router.post("/", isAuthorized, isAdmin, async (req, res, next) => {
  try {
    if (req.isAdmin) {
      const createdItem = await itemDAO.createItem(req.body);
      res.json(createdItem);
    } else {
      res.status(403).send("Forbidden - Admin role required");
    }
  } catch (e) {
    next(e);
  }
});

// Update item
router.put("/:id", isAuthorized, isAdmin, async (req, res, next) => {
  try {
    if (req.isAdmin) {
      const updated = await itemDAO.updateItem(req.params.id, req.body);
      if (updated) {
        res.sendStatus(200);
      }
    } else {
      res.status(403).send("Forbidden - Admin role required");
    }
  } catch (e) {
    next(e);
  }
});

// Error handle middleware
router.use(errorHandler);

module.exports = router;
