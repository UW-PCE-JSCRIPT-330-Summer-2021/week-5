const { Router } = require('express');
const router = Router();

const { isAuthorized, isAdmin } = require('../middleware/auth');

const itemDAO = require('../daos/item');

router.use(isAuthorized);

//Create: POST /items - restricted to users with the "admin" role
router.post("/", isAdmin, async (req, res, next) => {
    const itemTitle = req.body.title;
    const itemPrice = req.body.price;
    if (!itemTitle || !itemPrice) {
        res.status(400).send("Item title and price are required")
    } else {
        const newItem = await itemDAO.create(itemTitle, itemPrice);
        if (newItem) {
            res.json(newItem);
        } else {
            res.status(409).send("Item already exists");
        }
    }
});

//Get all items: GET /items - open to all users
router.get("/", async (req, res, next) => {
    const items = await itemDAO.getAll();
    if (items) {
        res.json(items);
    } else {
        res.status(404).send("Items not found");
    }
});

//Get item by id: GET /items/:id
router.get("/:id", async (req, res, next) => {
    const itemId = req.params.id;
    const item = await itemDAO.getById(itemId);
    if (item) {
        res.json(item);
    } else {
        res.status(404).send("Item not found");
    }
});

//Update a note: PUT /items/:id - restricted to users with the "admin" role
router.put("/:id", isAdmin, async (req, res, next) => {
    const itemId = req.params.id;
    const { price } = req.body;
    const updatedItem = await itemDAO.updateItem(itemId, price);
    if (updatedItem) {
        res.json(updatedItem);
    } else {
        res.status(404).send("Item needs to be updated");
    }
});

module.exports = router;