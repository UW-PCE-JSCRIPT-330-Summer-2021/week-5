const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');
const errorHandler = require('../middleware/error');

const itemDAO = require('../daos/item');

router.post('/', auth.isAdmin, async (req, res, next) => {
    try {
        const createdItem = await itemDAO.createItem(req.body);
        res.json(createdItem);
    } catch(e) {
        next(e);
    }
});

router.put('/:id', auth.isAdmin, async (req, res, next) => {
    try {
        const updatedItem = await itemDAO.updateItem(req.params.id, req.body);
        res.json(updatedItem);

    } catch(e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const foundItem = await itemDAO.getItemById(req.params.id);
        res.json(foundItem);
    } catch(e) {
        next(e);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const allItems = await itemDAO.getAll();
        res.json(allItems);
    } catch(e) {
        next(e);
    }
});

router.use(errorHandler);

module.exports = router;
