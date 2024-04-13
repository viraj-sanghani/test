const nodemailer = require("nodemailer");

const send = (mailOptions) => {
  return new Promise(function (resolve) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_PORT == 465,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    mailOptions.from = `${process.env.MAIL_FROM} ${process.env.MAIL_USER}`;

    transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
        resolve(err);
      } else {
        resolve(res);
      }
    });
  });
};

module.exports = { send };
