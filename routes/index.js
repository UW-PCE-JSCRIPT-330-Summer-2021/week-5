const { Router } = require("express");
const router = Router();

router.use("/coins", require('./coins')); 
router.use("/prices", require('./prices'));
router.use("/accounts", require('./accounts'));
router.use("/login", require('./login'));
// router.use("/users", require('./users'));


module.exports = router;
