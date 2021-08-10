const { Router } = require("express");
const router = Router();
const { isAuthorized, isAdmin } = require('../middleware/auth');

const itemDAO = require('../daos/item');

router.use(isAuthorized);

// Create: `POST /items` - restricted to users with the "admin" role
router.post('/', isAdmin, async (req, res, next) => {
  try {
    if (req.user.roles.includes('admin')) {
      const newItem = req.body;
      const createdItem = await itemDAO.createItem(newItem);
      res.json(createdItem);
    } else {
      res.sendStatus(403);
    }
  } catch (e) {
    next(e);
  }
})

// Update a note: `PUT /items/:id` - restricted to users with the "admin" role
router.put('/:id', isAdmin, async (req, res, next) => {
  const itemId = req.params.id;
  try {
    if (req.user.roles.includes('admin')) {
     const updatedItem = await itemDAO.updateItem(itemId, req.body);
    res.json(updatedItem); 
    } else {
      res.sendStatus(403);
    }
  } catch (e) {
    next(e);
  }
})

// Get all items: `GET /items` - open to all users
router.get('/', async (req, res, next) => {
  try {
    const items = await itemDAO.getAllItems();
    res.json(items);
  } catch (e) {
    next(e);
  }
})

// Get item by id: `GET /items/id` 
router.get('/:id', async (req, res, next) => {
  try {
    const item = await itemDAO.getItemById(req.params.id);
    if(item) {
      res.json(item);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    next(e)
  }
})

module.exports = router;