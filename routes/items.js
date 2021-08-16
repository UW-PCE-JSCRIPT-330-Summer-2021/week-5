const { Router } = require("express");
const router = Router();
const itemDAO = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/auth');

router.get("/", isAuthorized, async (req, res) => {
  try {
    const items = await itemDAO.getAll();
    return res.json(items)
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

router.get("/:id", isAuthorized, async (req, res) => {
  try {
    const item = await itemDAO.getItem(req.params.id);
    return res.json(item)
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

router.post("/", isAuthorized, isAdmin, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.sendStatus(403)
    }
    const createdItem = await itemDAO.createItem(req.body);
    return res.json(createdItem) 
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

router.put("/:id", isAuthorized, isAdmin, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.sendStatus(403)
    }
    const updated = await itemDAO.updateItem(req.params.id, req.body);
    return res.json(updated)
  } catch (e) {
    return res.status(500).send(e.message)
  }
});

module.exports = router;