const express = require("express");
const router = express.Router();
const requirement = require("./../controllers/requirement");
const { validAuth } = require("./../../../middlewares/auth");

router.get("/requirement-form", validAuth, requirement.getRequirementForm);
router.post("/requirement-fields", validAuth, requirement.getRequirementFields);
router.post("/post-requirement", validAuth, requirement.addRequirement);
router.get(
  "/edit-requirement/:requirementId",
  validAuth,
  requirement.editRequirementInfo
);
router.put("/update-requirement", validAuth, requirement.updateRequirement);
router.post("/requirement-filter", validAuth, requirement.getRequirmentFilter);
router.post("/requirements", validAuth, requirement.myRequirement);
router.post(
  "/community-requirements",
  validAuth,
  requirement.getCommunityRequirement
);
router.get(
  "/property-requirement/:id",
  validAuth,
  requirement.getPropertyRequirement
);
router.put("/active/:requirementId", validAuth, requirement.updateActive);
router.delete(
  "/delete/:requirementId",
  validAuth,
  requirement.deleteRequirement
);

module.exports = router;
