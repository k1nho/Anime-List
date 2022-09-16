const express = require("express");
router = express.Router();
firstRoute = require("../controllers/firstController");

router.get("/rental", firstRoute.firstController);

module.exports = router;
