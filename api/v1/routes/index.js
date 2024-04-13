const express = require("express");
const router = express.Router();
const auth = require("./auth");
const support = require("./support");
const activity = require("./activity");
const search = require("./search");
const property = require("./property");
const requirement = require("./requirement");
const bot = require("./bot");
const maps = require("./maps");
const report = require("./report");

router.use("/auth", auth);
router.use("/support", support);
router.use("/activity", activity);
router.use("/search", search);
router.use("/property", property);
router.use("/requirement", requirement);
router.use("/bot", bot);
router.use("/map", maps);
router.use("/report", report);

module.exports = router;
