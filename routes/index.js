const { Router } = require("express");
const router = Router();

router.use("/login", require('./login'));
router.use("/items", require('./items'));


module.exports = router;