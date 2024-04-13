const express = require("express");
const router = express.Router();
const maps = require("../controllers/maps");
const {
  validate,
  validateCoordToAdd,
  validatePlaces,
} = require("../../../middlewares/validate");

router.post(
  "/address-to-coordinates",
  validatePlaces,
  validate,
  maps.addressToCoordinates
);
router.post(
  "/coordinates-to-address",
  validateCoordToAdd,
  validate,
  maps.coordinatesToAddress
);

module.exports = router;
