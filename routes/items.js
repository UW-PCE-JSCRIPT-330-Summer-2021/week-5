const { Router } = require("express")
const router = Router()
const { isAuthorized, isAdmin } = require("../middleware/auth")
const itemDAO = require('../daos/item')

router.use(isAuthorized)

router.post("/", isAdmin, async (req, res, next) => {
    try {
        const item = await itemDAO.createItem(req.body)
        res.status(200).send(item)
    }
    catch (e) {
        next(e)
    }    
})

router.put("/:id", isAdmin, async (req, res, next) => {
    try {
        await itemDAO.updateItem(req.params.id, req.body)
        res.sendStatus(200)
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
        if (e.message.includes("invalid"))
            e.status = 400
        next(e)
    }
});

router.get("/", async (req, res, next) => {
    try {
        const items = await itemDAO.getAllItems()
        res.status(200).send(items)
    }
    catch (e) {
        next(e)
    }
})

module.exports = router
