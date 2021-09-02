const { Router } = require('express');
const router = Router();
const { isLoggedIn, isAdmin } = require("../middleware/auth");

const accountDAO = require('../daos/account');

// router.use(isLoggedIn);

router.post("/", async (req, res, next) => {
  try {
    const savedAccountData = await accountDAO.create(req.body);
    res.json(savedAccountData);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const account = req.body;
    if (!account || JSON.stringify(account) === "{}") {
      res.status(400).send("account id is required");
    }
    const accountId = req.params.id;
    const result = await accountDAO.updateAccountById(accountId, account);
    if (!result) {
      res.status(404).send("No match ID, no updates.");
    } else {
      res.json(result);
    }
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = req.user;
    const accountId = req.params.id;
    const account = await accountDAO.getAccountById(user, accountId);
    if (!account) {
      res.sendStatus(404);
    } else {
      res.json(account);
    }
  } catch (e) {
    next(e);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const user = req.user;
    const accounts = await accountDAO.getUserAccounts(user);
    res.json(accounts);
  } catch (e) {
    next(e);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    const user = req.user;
    const accounts = await accountDAO.getUserAccountStats(user);
    res.json(accounts);
  } catch (e) {
    next(e);
  }
});

// router.use(isAdmin);

router.delete("/:id", async (req, res, next) => {
  try {
    const account = await accountDAO.removeAccountById(req.params.id);
    if (!account) {
      res.sendStatus(404);
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
