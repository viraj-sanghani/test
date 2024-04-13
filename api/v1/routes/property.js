const express = require("express");
const router = express.Router();
const property = require("./../controllers/property");
const { verifyAuth, validAuth } = require("./../../../middlewares/auth");
const {
  validate,
  validateGetLocality,
  validateAddSiteVisit,
  validateAddContacted,
} = require("./../../../middlewares/validate");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const { imageTypes } = require("../../../utils/data");

router.get("/types", validAuth, property.getPropertyTypes);
router.post("/fields", validAuth, property.getPropertyFields);
router.get("/form-data", validAuth, property.getPropertyFormData);
router.get("/city", validAuth, property.getCity);
router.post(
  "/locality",
  validAuth,
  validateGetLocality,
  validate,
  property.getLocality
);
router.get("/users", validAuth, property.getUsers);
router.get("/staff-users", validAuth, property.getStaffUsers);
router.get("/my-listings", validAuth, property.myListings);
router.get("/leads", validAuth, property.leads);
router.get("/site-visits", validAuth, property.siteVisits);
router.get("/draft", validAuth, property.draftProperty);
router.post("/save", validAuth, property.saveProperty);
router.get("/edit/:propertyId", validAuth, property.editPropertyInfo);
router.put("/update/:propertyId", validAuth, property.updateProperty);
router.post(
  "/upload-image",
  validAuth,
  upload.fields(
    imageTypes.map((type) => ({
      name: type,
    }))
  ),
  property.uploadImages
);
router.get("/home", verifyAuth, property.home);
router.post("/add-share", verifyAuth, property.addSharedProperty);
router.get("/info/:id/:token", verifyAuth, property.info);
router.get("/info/:id", verifyAuth, property.info);
router.post("/compare/info", verifyAuth, property.compareInfo);
router.post(
  "/site-visit/add",
  validAuth,
  validateAddSiteVisit,
  validate,
  property.siteVisitAdd
);
router.post(
  "/contacted/add",
  validAuth,
  validateAddContacted,
  validate,
  property.addContacted
);
router.get(
  "/requirement-property/:id",
  validAuth,
  property.getRequirementProperty
);
router.put("/active/:propertyId", validAuth, property.updateActive);
router.delete("/delete/:propertyId", validAuth, property.deleteProperty);

module.exports = router;
