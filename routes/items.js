const { Router } = require("express");
const router = Router();

const itemDAO = require('../daos/item');
const { isAllowed, isAdmin } = require('../middlewares/auth');
const { errorHandler } = require('../middlewares/error');

// get all items
router.get("/", isAllowed, async (req, res, next) => {
    try {
        const getItems = await itemDAO.getAll();
        res.json(getItems);
    } catch (e) {
        next(e);
    }
});

// get unique item
router.get("/:id", isAllowed, async (req, res, next) => {
    try {
        const getItem = await itemDAO.getItem(req.params.id);
        res.json(getItem);
    } catch (e) {
        next(e);
    }
});

// admin can create item
router.post("/", isAllowed, isAdmin, async (req, res, next) => {
    try {
        const itemId = req.body;
        if (!itemId) {
            res.sendStatus(404);
        }
        if (req.isAdmin) {
            const createdItem = await itemDAO.createItem(req.body);
        if (!createdItem) {
            res.sendStatus(404);
        } res.json(createdItem); } else {
            res.sendStatus(403);
        }
    } catch (e) {
        next(e);
    }
});

// updating item
router.put("/:id", isAllowed, isAdmin, async (req, res, next) => {
    try {
        const itemId = req.body;
        if (!itemId) {
            res.sendStatus(404);
        }
        if (req.isAdmin) {
            const updatedItem = await itemDAO.updateItem(req.params.id, req.body);
            if (updatedItem) {
                res.sendStatus(200);
            }
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        next(e);
    }
});

router.use(errorHandler);

module.exports = router;
