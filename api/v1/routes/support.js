const express = require("express");
const router = express.Router();
const support = require("./../controllers/support");
const {
  validate,
  validateContactUs,
  validateFeedback,
  validateNewsLetter,
  validateTicketNew,
} = require("./../../../middlewares/validate");

const { validAuth } = require("./../../../middlewares/auth");

router.get("/faq", support.getFAQ);
router.post("/contact-us", validateContactUs, validate, support.contactus);
router.post("/feedback", validateFeedback, validate, support.feedback);
router.post("/news-letter", validateNewsLetter, validate, support.newsLetter);
router.get("/tickets", validAuth, support.ticketList);
router.post(
  "/ticket/new",
  // validateTicketNew,
  // validate,
  validAuth,
  support.newTicket
);
router.put("/ticket/:ticketId", validAuth, support.updateTicket);

module.exports = router;
