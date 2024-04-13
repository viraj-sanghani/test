const express = require("express");
const router = express.Router();
const search = require("./../controllers/search");
const { verifyAuth } = require("./../../../middlewares/auth");
const { validate, validateSuggest } = require("../../../middlewares/validate");

router.post("/get-filters", search.getFilters);
router.post("/suggest", validateSuggest, validate, search.suggest);
router.post("/filter", verifyAuth, search.filter);

module.exports = router;
