const { Router } = require('express');

const { isAuthenticated, isAdmin } = require('../middleware/auth');
const router = Router();
const errorHandler = require('../middleware/error');

const itemDAO = require('../daos/items');
const userDAO = require('../daos/user');

// create item
router.post('/', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    const createdItem = await itemDAO.createItem(req.body);
    return res.json(createdItem);
  } catch (e) {
    next(e);
  }
});

//update item
router.put('/:id', isAuthenticated, isAdmin, async (req, res, next) => {
  try {
    if ((req.user.isAdmin = 'admin')) {
      const recordupdated = await itemDAO.updateItem(req.params.id, req.body);

      if (recordupdated) {
        res.json(recordupdated).sendStatus(200);
      }
    } else {
      res.status(403).send('Forbidden - Admin role require');
    }
  } catch (e) {
    next(e);
  }
});

// selected one item by
router.get('/:id', async (req, res, next) => {
  try {
    const selectedItem = await itemDAO.getItemById(req.params.id);
    res.json(selectedItem);
  } catch (e) {
    next(e);
  }
});

// Get all items
router.get('/', async (req, res, next) => {
  try {
    const getAllItems = await itemDAO.getAll();
    res.json(getAllItems);
  } catch (e) {
    next(e);
  }
});

router.use(errorHandler);

module.exports = router;
