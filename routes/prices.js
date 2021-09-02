const { Router } = require("express")
const router = Router()

const { isLoggedIn, isAdmin } = require("../middleware/auth")
const pricesDAO = require('../daos/price')

// router.use(isLoggedIn);

router.get("/", async (req, res, next) => {
    try {
        const coinPrices = await pricesDAO.getPrices();
        res.json(coinPrices);
    } catch (e) {
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const priceId = req.params.id;
        return await pricesDAO.getPricesById(priceId);
    } catch (e) {
        next(e);
    }
});

router.get("/trend/:id", async (req, res, next) => {
    try {
        const priceId = req.params.id;
        const days = parseInt(req.query.days);
        const priceData = await pricesDAO.getPricesById(priceId);
        if (days === 1) {
            res.json(priceData.prices_hourly);
        } else {
            const prices = priceData.prices_daily.slice(-(days + 1));
            res.json(prices);
        }
    } catch (e) {
        next(e);
    }
});

// router.use(isAdmin);

router.post("/", async (req, res, next) => {
    try {
        const price = req.body;
        const newPrice = await pricesDAO.create(price);
        res.json(newPrice);
    } catch (e) {
        if (e.message.includes("create price failed")) {
            res.sendStatus(400)
        }
        next(e);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const coinId = req.params.id;
        if (!coinId) {
            res.status(400).send('coin id is required');
        } else {
            const result = await pricesDAO.updateById(coinId);
            if (!result) {
                res.status(404).send('No match ID, no updates.');
            } else {
                res.json(result);
            }
        }
    } catch (error) {

    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const coin = await pricesDAO.removeById(req.params.id);
        if (!coin) {
            res.sendStatus(404);
        } else {
            res.sendStatus(200);
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;
