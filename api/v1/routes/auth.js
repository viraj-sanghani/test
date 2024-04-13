const express = require("express");
const router = express.Router();
const auth = require("./../controllers/auth");
const { validAuth } = require("./../../../middlewares/auth");
const { decrypt } = require("./../../../utils/crypto");
const {
  validate,
  validateLogin,
  validateSignup,
  validateForgot,
  validateReset,
  validateChangePass,
} = require("./../../../middlewares/validate");

router.get("/verify", validAuth, auth.verify);
router.get("/logout", auth.logout);
router.post("/login", decrypt, validateLogin, validate, auth.localLogin);
router.post("/register", decrypt, validateSignup, validate, auth.localRegister);
router.post("/account-verify", auth.accountVerify);
router.get("/google", auth.googleLogin);
router.get("/google/callback", auth.googleCallback);
router.get("/facebook", auth.facebookLogin);
router.get("/facebook/callback", auth.facebookCallback);
router.post("/forgot-password", validateForgot, validate, auth.forgotPassword);
router.post("/forgot-verify", auth.forgotVerify);
router.post(
  "/reset-password",
  decrypt,
  validateReset,
  validate,
  auth.resetPassword
);
router.post(
  "/change-password",
  decrypt,
  validAuth,
  validateChangePass,
  validate,
  auth.changePassword
);

router.get("/profile", validAuth, auth.userProfile);
router.put("/profile", validAuth, auth.updateUser);

module.exports = router;
