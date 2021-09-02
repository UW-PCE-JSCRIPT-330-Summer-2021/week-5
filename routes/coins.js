const { Router } = require('express');
const router = Router();
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const coinDAO = require('../daos/coin');

router.get("/", async (req, res, next) => {
    try {
        const coin = await coinDAO.getAll();
        res.json(coin);
    } catch (e) {
        next(e);
    }
});

router.get("/stats", async (req, res, next) => {
    try {
        const coin = await coinDAO.getAll();
        res.json(coin);
    } catch (e) {
        next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const coin = await coinDAO.getCoinById(req.params.id);
        if (!coin) {
            res.sendStatus(404);
        } else {
            res.json(coin);
        }
    } catch (e) {
        next(e);
    }
});

// router.use(isLoggedIn);
// router.use(isAdmin);

router.post("/", async (req, res, next) => {
    try {
        const savedCoinData = await coinDAO.create(req.body);
        res.json(savedCoinData);
    } catch (e) {
        next(e);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const coin = req.body;
        if (!coin || JSON.stringify(coin) === "{}") {
            res.status(400).send("coin id is required");
        }
        const coinId = req.params.id;
        const result = await coinDAO.updateById(coinId, coin);
        if (!result) {
            res.status(404).send("No match ID, no updates.");
        } else {
            res.json(result);
        }
    } catch (e) {
        next(e);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const coin = await coinDAO.removeById(req.params.id);
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
