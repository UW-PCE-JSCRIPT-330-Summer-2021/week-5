const { Router } = require("express");
const router = Router({ mergeParams: true });

const itemDAO = require("../daos/item");
const isValid = require("../middleware/authentication");
const isAdmin = require("../middleware/authorization");

router.use(async (req, res, next) => {
    isValid(req, res, next);

});

// POST /items - restricted to users with the "admin" role

router.post("/", async (req, res, next) => {
    const item = req.body;
    if (!item) {
        res.sendStatus(404).send("Item not found");
        return;
    }
    if (!isAdmin(req.user.roles)) {
        res.sendStatus(403);
        return;
    }

    const postedItem = await itemDAO.createItem(item);

    if (!postedItem) {
        res.sendStatus(404).send("Item not found");
        return;
    }
    res.json(postedItem);

});

// PUT /items/:id - restricted to users with the "admin" role

router.put("/:id", async (req, res, next) => {
    const item = req.body;
    const id = req.params.id;
    if (!isAdmin(req.user.roles)) {
        res.sendStatus(403);
        return;
    }

    if (!item) {
        res.sendStatus(404).send("Item not found");
        return;

    }
    const updatedItem = await itemDAO.updateItem(id, item);
    if (!updatedItem) {
        res.sendStatus(404).send("Item not found");
        return;
    }
    res.json(updatedItem);

});
//GET /item - open to all users

router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    const item = await itemDAO.getItem(id);
    if (!item) {
        res.sendStatus(404).send("Item not found");
        return;

    }
    res.json(item);
});

//GET /item - open to all users

router.get("/", async (req, res, next) => {
    const items = await itemDAO.getItems();
    if (items) {
        res.json(items);
    } else {
        res.sendStatus(404).send("Items not found");
        return;
    }

});




module.exports = router;