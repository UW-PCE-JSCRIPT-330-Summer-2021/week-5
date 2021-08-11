const { Router } = require("express");
const router = Router({ mergeParams: true });


const itemDAO = require("../dao/item");
const isValidUser = require("../middleware/authen");
const isValidAdmin = require("../middleware/author");


router.use(async (req, res, next) => {
    isValidUser(req, res, next);


});



router.post("/", async (req, res, next) => {
    const item = req.body;
    if (!item) {
        res.sendStatus(404).send("Item is not found");
        return;
    }
    if (!isValidAdmin(req.user.roles)) {
        res.sendStatus(403);
        return;
    }


    const postedItem = await itemDAO.createItem(item);


    if (!postedItem) {
        res.sendStatus(404).send("Item is not found");
        return;
    }
    res.json(postedItem);


});



router.put("/:id", async (req, res, next) => {
    const item = req.body;
    const id = req.params.id;
    if (!isValidAdmin(req.user.roles)) {
        res.sendStatus(403);
        return;
    }


    if (!item) {
        res.sendStatus(404).send("Item is not found");
        return;


    }
    const updatedItem = await itemDAO.updateItem(id, item);
    if (!updatedItem) {
        res.sendStatus(404).send("Item is not found");
        return;
    }
    res.json(updatedItem);


});

router.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    const item = await itemDAO.getItem(id);
    if (!item) {
        res.sendStatus(404).send("Item is not found");
        return;


    }
    res.json(item);
});


router.get("/", async (req, res, next) => {
    const items = await itemDAO.getItems();
    if (items) {
        res.json(items);
    } else {
        res.sendStatus(404).send("Items is not found");
        return;
    }


});

module.exports = router; 
