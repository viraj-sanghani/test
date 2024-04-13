const { body, validationResult } = require("express-validator");
const moment = require("moment");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = {};
  errors.array().map((err) => {
    extractedErrors[err.param] = err.msg;
  });

  return res.status(400).json({
    success: false,
    errors: extractedErrors,
  });
};

const isNotSmallerThanToday = (value) => {
  const dateTime = moment(value, "DD/MM/YYYY hh:mm A");
  if (!dateTime.isValid() || dateTime.isBefore(moment())) {
    throw new Error("DateTime must not be smaller than today");
  }
  return true;
};

const fieldValidations = {
  name: body("name").notEmpty().withMessage("Name is required"),
  city: body("city").notEmpty().withMessage("city name is required"),
  email: body("email").isEmail().withMessage("Invalid email id"),
  mobile: body("mobile").isMobilePhone().withMessage("Invalid mobile no"),
  password: body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  userType: body("userType").notEmpty().withMessage("User Type is required"),
  firstName: body("firstName")
    .notEmpty()
    .withMessage("Please enter first name"),
  lastName: body("lastName").notEmpty().withMessage("Please enter last name"),
  message: body("message").notEmpty().withMessage("Please enter message"),
  propertyId: body("propertyId")
    .notEmpty()
    .withMessage("please enter property id (propertyId)"),
  prop_id: body("prop_id")
    .notEmpty()
    .withMessage("please enter property id (prop_id)"),
  dateTime: body("dateTime").custom(isNotSmallerThanToday),
  locality: body("locality").notEmpty().withMessage("locality is required"),
  type: body("type").notEmpty().withMessage("type is required"),
  url: body("url").notEmpty().withMessage("url is required"),
  latitude: body("latitude").notEmpty().withMessage("latitude is required"),
  longitude: body("longitude").notEmpty().withMessage("longitude is required"),
  // Schedule Visit
  alongWith: body("alongWith")
    .notEmpty()
    .withMessage("please enter alongWith (the person you are visiting with)"),
  // Contact Owner
  siteVisit: body("siteVisit").notEmpty().withMessage("siteVisit is required"),
  isDealer: body("isDealer").notEmpty().withMessage("isDealer is required"),
};

const {
  name,
  city,
  email,
  mobile,
  password,
  userType,
  firstName,
  lastName,
  message,
  prop_id,
  dateTime,
  propertyId,
  locality,
  type,
  url,
  latitude,
  longitude,
  alongWith,
  siteVisit,
  isDealer,
} = fieldValidations;

const validatePlaces = [
  body("places").notEmpty().withMessage("term is required for suggest"),
];

const validateSuggest = [
  body("term").notEmpty().withMessage("term is required for suggest"),
];

const validateCoordToAdd = [latitude, longitude];

const validateAddHistory = [city, type, url];

const validateRemoveShortlist = [propertyId];

const validateAddShortList = [propertyId];

const validateAddContacted = [
  name,
  email,
  mobile,
  propertyId,
  siteVisit,
  isDealer,
];

const validateAddSiteVisit = [
  dateTime,
  name,
  mobile,
  email,
  message,
  prop_id,
  alongWith,
];

const validateGetLocality = [
  /* fieldValidations.city */
];

const validateSignup = [name, email, mobile, password, userType];

const validateLogin = [/* userType, */ mobile, password];

const validateForgot = [email];

const validateReset = [
  password,
  body("token").notEmpty().withMessage("Token not passed"),
];

const validateChangePass = [
  body("oldPass")
    .isLength({ min: 6 })
    .withMessage("Old Password must be at least 6 characters"),
  body("newPass")
    .isLength({ min: 6 })
    .withMessage("New Password must be at least 6 characters"),
];

const validateContactUs = [firstName, lastName, email, mobile, message];
const validateFeedback = [
  name,
  email,
  body("feedback").notEmpty().withMessage("Please enter message"),
];
const validateNewsLetter = [email];

const validateTicketNew = [
  body("subject").notEmpty().withMessage("Subject is required"),
  name,
  email,
  body("issue").notEmpty().withMessage("Please enter issue"),
];

const validatePostRequirement = [
  body("city").notEmpty().withMessage("City is required"),
  body("locality").notEmpty().withMessage("Locality is required"),
  body("community").notEmpty().withMessage("Community is required"),
  body("property_for").notEmpty().withMessage("property_for is required"),
  body("property_type").notEmpty().withMessage("Property type is required"),
  body("furnish_status").notEmpty().withMessage("Furnish status is required"),
  body("budget_min").notEmpty().withMessage("Min budget is required"),
  body("budget_max").notEmpty().withMessage("Max budget is required"),
];

module.exports = {
  validate,
  validateSignup,
  validateLogin,
  validateForgot,
  validateReset,
  validateChangePass,
  validateContactUs,
  validateFeedback,
  validateNewsLetter,
  validateGetLocality,
  validateAddSiteVisit,
  validateAddContacted,
  validateAddShortList,
  validateRemoveShortlist,
  validateAddHistory,
  validateCoordToAdd,
  validateSuggest,
  validatePlaces,
  validatePostRequirement,
  validateTicketNew,
};
