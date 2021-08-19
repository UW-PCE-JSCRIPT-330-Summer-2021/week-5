const { Router } = require("express")
const router = Router()

const { isAuthorized, isAdmin } = require("../middleware/auth")
const itemDAO = require('../daos/item')

router.use(isAuthorized)

router.post("/", isAdmin, async (req, res, next) => {
    try {
        const item = req.body
        const savedItem = await itemDAO.createItem(item);
        res.status(200).send(savedItem);
    }
    catch (e) {
        next(e);
    }
})

router.put("/:id", isAdmin, async (req, res, next) => {
    try {
        const updated = await itemDAO.updateItem(req.params.id, req.body)
        res.status(200).send(updated)
    }
    catch (e) {
        next(e)
    }
})

router.get("/:id", async (req, res, next) => {
    try {
        const item = await itemDAO.getItem(req.params.id)
        if (!item) {
            res.sendStatus(404)
        }
        else {
            res.status(200).send(item)
        }
    }
    catch (e) {
        next(e);
    }
})

router.get("/", async (req, res, next) => {
    try {
        const items = await itemDAO.getAll()
        res.status(200).send(items)
    }
    catch (e) {
        next(e)
    }
})

module.exports = router;
