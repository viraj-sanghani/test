const express = require("express");
const router = express.Router();
const bot = require("./../controllers/bot");
const { verifyAuth } = require("../../../middlewares/auth");

router.post("/properties", verifyAuth, bot.properties);

module.exports = router;
