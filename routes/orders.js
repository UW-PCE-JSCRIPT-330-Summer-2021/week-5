const { Router } = require("express")
const router = Router()
const { isAuthorized, isAdmin } = require("../middleware/auth")
const orderDAO = require('../daos/order')
const itemDAO = require('../daos/item')

router.use(isAuthorized)

router.post("/", async (req, res, next) => {
    try {
        const listOfItemIds = req.body;
        let totalPrice = 0;
        const items = [];
        
        for (let i = 0; i < listOfItemIds.length; i++) {
            let item = await itemDAO.getItem(listOfItemIds[i]);
            if (!item) {
                res.status(400).send("Invalid item");
                return;
            }
            // items.push({
            //     price: item.price,
            //     title: item.title
            // });
            items.push(item._id);
            totalPrice += item.price;
        }

        const order = await orderDAO.createOrder({
            items,
            userId: req.user._id,
            total: totalPrice
        });
        res.status(200).send(order)
    }
    catch (e) {
        next(e)
    }    
})

router.put("/:id", isAdmin, async (req, res, next) => {
    try {
        await orderDAO.updateOrder(req.params.id, req.body)
        res.sendStatus(200)
    }
    catch (e) {
        next(e)
    }    
})

router.get("/:id", isAdmin, async (req, res, next) => {
    try {
        const order = await orderDAO.getOrder(req.params.id)
        if (!order) {
            res.sendStatus(404)
        }
        else {
            if (order.userId.toHexString() !== req.user._id && !req.isAdmin) {
                res.sendStatus(404);
                return;
            }
            res.status(200).send(order);
        }
    }
    catch (e) {
        if (e.message.includes("invalid"))
            e.status = 400
        next(e)
    }
});

router.get("/", isAdmin, async (req, res, next) => {
    try {
        const orders = await orderDAO.getOrdersForCustomer(req.user._id, req.isAdmin)
        res.status(200).send(orders)
    }
    catch (e) {
        next(e)
    }
})

module.exports = router
