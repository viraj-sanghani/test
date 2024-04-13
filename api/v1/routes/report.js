const express = require("express");
const router = express.Router();
const report = require("./../controllers/report");
const { validStaff } = require("../../../middlewares/auth");

router.post("/user-listings", validStaff, report.userListings);

module.exports = router;
