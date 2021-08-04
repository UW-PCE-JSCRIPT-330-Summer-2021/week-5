const { Router } = require("express");
const router = Router();

router.use("/login", require("./login"));

module.exports = router;