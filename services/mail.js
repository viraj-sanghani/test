const config = require("./../api/config");
const mailer = require("./../utils/mailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const mail = {};

const subjects = {
  verify: "Account Verification - HousingMagic",
  reset: "Password Reset Request - HousingMagic",
  contactusAdm: "New Contact Us Inquiry - HousingMagic",
  contactusCst: "Thank You for Contacting Us!",
  feedbackAdm: "New Customer Feedback - HousingMagic",
  feedbackCst: "Thank You for Your Feedback - HousingMagic",
  visitOwn: "New Visit Schedule for Your Property - HousingMagic",
  visitCst: "Confirming Your Scheduled Property Visit - HousingMagic",
  contactedOwn: "Customer Inquiry for Your Property - HousingMagic",
  contactedCst: "Thank You for Your Inquiry - HousingMagic",
  supportAdm: "New Support Ticket",
  supportCst: "Support Ticket Created",
  supportUpdCst: "Support Ticket Update",
};

const getData = (file, replace) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await fs.promises.readFile(`static/${file}`, "utf-8");
      let html = data;
      for (const key in replace) {
        html = html.replaceAll(key, replace[key]);
      }
      resolve(html);
    } catch (err) {
      reject(err);
    }
  });
};

mail.verifyAccount = (to, id, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      let token = jwt.sign(
        {
          id: id,
          time: Date.now(),
        },
        config.JWT_SECRET
      );

      const html = await getData("verify-account.html", {
        URL: `${config.CLIENT_URL}/auth/account-verify/${token}`,
        USER_NAME: name,
      });
      mailer.send({ to, subject: subjects.verify, html });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

mail.resetPassword = (to, id, name, validTime) => {
  return new Promise(async (resolve, reject) => {
    try {
      const random = Math.floor(Math.random() * 1e16);
      let token = jwt.sign(
        {
          id: id,
          time: Date.now(),
          forgotToken: random,
        },
        config.JWT_SECRET
      );

      const html = await getData("reset-password.html", {
        URL: `${config.CLIENT_URL}/auth/reset-password/${token}`,
        USER_NAME: name,
        VALID_TIME: validTime,
      });
      mailer.send({ to, subject: subjects.reset, html });

      resolve(random);
    } catch (err) {
      reject(err);
    }
  });
};

mail.contactus = (to, firstName, lastName, mobile, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const htmlCust = await getData("contactus-customer.html", {
        USER_NAME: `${firstName} ${lastName}`,
      });
      mailer.send({ to, subject: subjects.contactusCst, html: htmlCust });

      const htmlAdmin = await getData("contactus-admin.html", {
        NAME: `${firstName} ${lastName}`,
        EMAIL_ID: to,
        MOBILE: mobile,
        MESSAGE: message,
      });
      mailer.send({
        to: config.ADMIN_EMAIL,
        subject: subjects.contactusAdm,
        html: htmlAdmin,
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

mail.feedback = (to, name, rating, message) => {
  return new Promise(async (resolve, reject) => {
    try {
      const htmlCust = await getData("feedback-customer.html", {
        USER_NAME: name,
      });
      mailer.send({ to, subject: subjects.feedbackCst, html: htmlCust });

      let stars = "";
      for (let i = 0; i < rating || 0; i++) {
        stars +=
          '<img style="width: 50px; height: 50px; margin: 0 5px" src="https://img.icons8.com/fluency/256/star.png" />';
      }

      const htmlAdmin = await getData("feedback-admin.html", {
        NAME: name,
        EMAIL_ID: to,
        MESSAGE: message,
        RATING_STARS: stars,
      });
      mailer.send({
        to: config.ADMIN_EMAIL,
        subject: subjects.feedbackAdm,
        html: htmlAdmin,
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

mail.siteVisit = (
  to,
  owner,
  name,
  mobile,
  message,
  dateTime,
  alongWith,
  property
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const htmlCust = await getData("visit-customer.html", {
        USER_NAME: name,
        PROPERTY_URL: property?.url,
        PROPERTY_IMG: property?.img,
        PROPERTY_TITLE: property?.title,
        PROPERTY_DESC: property?.desc,
        PROPERTY_TYPE: property?.type,
        LOCATION: property?.location,
        DATE_TIME: dateTime,
      });
      mailer.send({ to, subject: subjects.visitCst, html: htmlCust });

      if (owner?.email) {
        const htmlOwner = await getData("visit-owner.html", {
          USER_NAME: owner?.name,
          PROPERTY_URL: property?.url,
          PROPERTY_IMG: property?.img,
          PROPERTY_TITLE: property?.title,
          PROPERTY_DESC: property?.desc,
          NAME: name,
          EMAIL_ID: to,
          MOBILE: mobile,
          DATE_TIME: dateTime,
          ALONG_WITH: alongWith,
          MESSAGE: message,
        });
        mailer.send({
          to: owner?.email,
          subject: subjects.visitOwn,
          html: htmlOwner,
        });
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

mail.contacted = (
  to,
  owner,
  name,
  mobile,
  reasonToBuy,
  isDealer,
  planningToBuy,
  homeLoan,
  siteVisit,
  property
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const htmlCust = await getData("contacted-customer.html", {
        USER_NAME: name,
        PROPERTY_URL: property?.url,
        PROPERTY_IMG: property?.img,
        PROPERTY_TITLE: property?.title,
        PROPERTY_DESC: property?.desc,
      });
      mailer.send({ to, subject: subjects.contactedCst, html: htmlCust });

      if (owner?.email) {
        const htmlOwner = await getData("contacted-owner.html", {
          USER_NAME: owner?.name,
          PROPERTY_URL: property?.url,
          PROPERTY_IMG: property?.img,
          PROPERTY_TITLE: property?.title,
          PROPERTY_DESC: property?.desc,
          NAME: name,
          EMAIL_ID: to,
          MOBILE: mobile,
          PROPERTY_DEALER: isDealer,
          INTERESTED_IN_VISIT: siteVisit,
          OTHER: reasonToBuy
            ? `
          <p><b>Reason to Buy</b>: ${reasonToBuy}</p>
          <p><b>Plannig to Buy Till</b>: ${planningToBuy}</p>
          <p><b>Interested in Home Loan</b>: ${homeLoan}</p>
        `
            : "",
        });
        mailer.send({
          to: owner?.email,
          subject: subjects.contactedOwn,
          html: htmlOwner,
        });
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

mail.ticketCreated = (
  to,
  name,
  message,
  createdAt,
  ticketURL,
  ticketId,
  ticketSub
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const htmlCust = await getData("support-customer.html", {
        USER_NAME: name,
        TICKET_ID: ticketId,
        TICKET_SUBJECT: ticketSub,
        CREATED_AT: createdAt,
        NAME: name,
        EMAIL_ID: to,
        MESSAGE: message,
        URL: ticketURL,
      });
      mailer.send({
        to,
        subject: `${subjects.supportCst} - ${ticketSub}`,
        html: htmlCust,
      });

      const htmlAdmin = await getData("support-admin.html", {
        TICKET_ID: ticketId,
        TICKET_SUBJECT: ticketSub,
        NAME: name,
        EMAIL_ID: to,
        MESSAGE: message,
        URL: ticketURL,
      });
      mailer.send({
        to: config.ADMIN_EMAIL,
        subject: `${subjects.supportAdm} - ${ticketSub}`,
        html: htmlAdmin,
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

mail.ticketUpdate = (
  to,
  name,
  message,
  createdAt,
  ticketURL,
  ticketId,
  ticketSub,
  status
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const htmlCust = await getData("support-update-customer.html", {
        USER_NAME: name,
        TICKET_ID: ticketId,
        TICKET_SUBJECT: ticketSub,
        CREATED_AT: createdAt,
        MESSAGE: message,
        URL: ticketURL,
        STATUS: status,
      });
      mailer.send({
        to,
        subject: `${subjects.supportUpdCst} - ${ticketSub}`,
        html: htmlCust,
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = mail;
