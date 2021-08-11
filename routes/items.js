const { Router } = require("express");
const router = Router();

const itemDAO = require('../daos/item');
const { isAuthorized, isAdmin } = require('../middleware/authorization');
const { errorHandler } = require('../middleware/errorHandler');


//Create: POST/
//restricted to users with the "admin" role
//isAdmin
//isAuthorized: checks to see if user has authorization
router.post("/", isAuthorized, isAdmin, async (req, res, next) => {
    try {
        //checks to see if the request was made from an admin
        if (req.isAdmin) {
            //if it is, then an item is created
            const item = await itemDAO.createItem(req.body);
            //should send 200 and store the item
            res.status(200).send(item);
        }
        else {
            //should send 403 and not create the item
            res.sendStatus(403);
        }
    }
    catch (e) {
        next(e);
    }
});

//Update a note: PUT/:id
//restricted to users with the "admin" role
//isAdmin
//isAuthorized: checks to see if user has authorization
router.put("/:id", isAuthorized, isAdmin, async (req, res, next) => {
    const itemList = req.body;
    const itemId = req.params.id;
    try {
        //checks to see if teh request was made from an admin
        if (req.isAdmin) {
            //if it is, then an item is updated
            const updateItem = await itemDAO.updateItem(itemId, itemList);
            //if item got updated
            if (updateItem) {
                //should send 200 and update the item
                res.status(200).send(updateItem);
            }
        }
        else {
            //should send 403 and not update the item
            res.sendStatus(403);
        }
    }
    catch (e) {
        next(e);
    }
});

//Get all items: Get/
//open to all users
//getItems DAO module
//isAuthorized: checks to see if user has authorization
router.get("/", isAuthorized, async (req, res, next) => {
    try {
        //uses item DAO to get all items
        const allItems = await itemDAO.getItems();
        //should send 200 and get all items
        res.status(200).send(allItems);
    }
    catch (e) {
        next(e);
    }
});

//Get one item: Get/:id
//open to all users
//getOneItem DAO module
//isAuthorized: checks to see if user has authorization
router.get("/:id", isAuthorized, async (req, res, next) => {
    const itemId = req.params.id;
    try {
        //usds item DAO to get one item
        const oneItem = await itemDAO.getOneItem(itemId);
        //if one item is gotten
        if (oneItem) {
            //should send 200 and get an item
            res.status(200).send(oneItem);
        }
        else {
            //should send 403 and not get an item
            res.sendStatus(404);
        }
    }
    catch (e) {
        next(e);
    }
});

//error handling middleware
router.use(errorHandler);

module.exports = router;