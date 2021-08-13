const { Router } = require('express');
const router = Router();
const itemDAO = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/authentication');

// - Items (requires authentication)
//   - Create: `POST /items` - restricted to users with the "admin" role
//   - Update a note: `PUT /items/:id` - restricted to users with the "admin" role
//   - Get all items: `GET /items` - open to all users

router.use(isAuthorized);

router.post("/", isAdmin, async (req, res, next) => {
    try {
        if (req.user.roles.includes("admin")) {
            const newItems = req.body;
            const createdItem = await itemDAO.createItem(newItems);
            res.json(createdItem);
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        next(e)
    }
});

router.get("/", async (req, res, next) => {
    try {
        const storedItems = await itemDAO.getAll();
        res.json(storedItems);
    } catch (e) {
        next(e)
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const item = await itemDAO.getItemById(id);
        if (!item) {
            res.sendStatus(404);
        } else {
            res.json(item);
        }
    } catch (e) {
        next(e)
    }
});

router.put("/:id", isAdmin, async (req, res, next) => {
    const itemId = req.params.id;
    try {
        if (req.user.roles.includes("admin")) {
            const updateItem = await itemDAO.updateItem(itemId, req.body);
            res.json(updateItem);
        } else {
            res.sendStatus(403);
        }
    } catch (e) {
        next(e)
    }
});

module.exports = router;