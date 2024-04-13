const express = require("express");
const router = express.Router();
const activity = require("./../controllers/activity");
const { validAuth } = require("./../../../middlewares/auth");
const {
  validate,
  validateAddShortList,
  validateRemoveShortlist,
  validateAddHistory,
} = require("../../../middlewares/validate");

router.get("/shortlisted", validAuth, activity.shortlisted);
router.get("/viewed", validAuth, activity.viewed);
router.get("/contacted", validAuth, activity.contacted);
router.post(
  "/shortlist/add",
  validAuth,
  validateAddShortList,
  validate,
  activity.addShortlist
);
router.post(
  "/shortlist/remove",
  validAuth,
  validateRemoveShortlist,
  validate,
  activity.removeShortlist
);
router.post(
  "/history/add",
  validAuth,
  validateAddHistory,
  validate,
  activity.addHistory
);
router.get("/history", validAuth, activity.getHistory);
router.get("/site-visits", validAuth, activity.getSiteVisits);

module.exports = router;
