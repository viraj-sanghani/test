const Contactus = require("./../models/Contactus");
const Feedback = require("./../models/Feedback");
const NewsLetter = require("./../models/NewsLetter");
const Faq = require("./../models/Faq");
const { success, error } = require("./../../../utils/response");
const mail = require("./../../../services/mail");
const messages = require("../../../utils/messages");
const SupportTicket = require("../models/SupportTicket");
const s3 = require("./../../../services/aws-s3");
const moment = require("moment/moment");
const config = require("../../config");

const support = {};

support.getFAQ = async (req, res) => {
  try {
    const data = await Faq.findAll({
      attributes: ["question", "answer"],
    });
    return success(res, 200, {
      data,
    });
  } catch (err) {
    return error(res, 500);
  }
};

support.contactus = async (req, res) => {
  const { firstName, lastName, email, mobile, message } = req.body;
  try {
    await Contactus.create({
      firstName,
      lastName,
      email,
      mobile,
      message,
    });
    await mail.contactus(email, firstName, lastName, mobile, message);
    return success(res, 200, {
      message: messages.contactUsSuccess,
    });
  } catch (err) {
    return error(res, 500);
  }
};

support.feedback = async (req, res) => {
  const { name, email, rating, feedback: message } = req.body;
  try {
    await Feedback.create({
      name,
      email,
      rating,
      message,
    });
    await mail.feedback(email, name, rating, message);
    return success(res, 200, {
      message: messages.feedbackSuccess,
    });
  } catch (err) {
    return error(res, 500);
  }
};

support.newsLetter = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await NewsLetter.findAll({ where: { email } });
    if (!result[0]) {
      await NewsLetter.create({
        email,
      });
    }

    return success(res, 200, {
      message: messages.newsLetterSuccess,
    });
  } catch (err) {
    return error(res, 500);
  }
};

support.ticketList = async (req, res) => {
  const userId = req.userId;
  try {
    const data = await SupportTicket.findAll({ where: { userId } });

    return success(res, 200, {
      data,
    });
  } catch (err) {
    return error(res, 500);
  }
};

support.newTicket = async (req, res) => {
  try {
    s3.uploadSupportFile(req, res, async (err) => {
      if (err) {
        return error(res, 500);
      }

      const files = [];

      if (req?.files) {
        req.files.forEach((ele) => {
          files.push(ele.key.slice(ele.key.lastIndexOf("/") + 1));
        });
      }

      const data = {
        ticketId: "T-" + Math.floor(Math.random() * 1000000),
        userId: req.userId,
        subject: req.body.subject,
        name: req.body.name,
        email: req.body.email,
        issue: req.body.issue,
        files: files.join(","),
        status: "Pending",
      };

      await SupportTicket.create(data);

      await mail.ticketCreated(
        data.email,
        data.name,
        data.issue,
        moment().format("LLL"),
        `${config.CLIENT_URL}/support`,
        data.ticketId,
        data.subject
      );

      return success(res, 200, {
        message: messages.ticketCreatedSuccess,
      });
    });
  } catch (err) {
    return error(res, 500);
  }
};

support.updateTicket = async (req, res) => {
  const ticketId = req.params.ticketId;
  const status = req.body.status;

  try {
    const data = await SupportTicket.findOne({ where: { ticketId } });
    if (!data) throw new Error();

    await data.update({ status: status });

    await mail.ticketUpdate(
      data.email,
      data.name,
      data.issue,
      moment(data.createdAt).format("LLL"),
      `${config.CLIENT_URL}/support`,
      data.ticketId,
      data.subject,
      status
    );

    return success(res, 200);
  } catch (err) {
    return error(res, 500);
  }
};

module.exports = support;
