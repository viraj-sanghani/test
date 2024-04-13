const messages = require("./messages");

const success = (res, statusCode, mes = {}) => {
  return res.status(statusCode).json({ success: true, ...mes });
};

const error = (res, statusCode, mes = {}) => {
  if (statusCode === 500) {
    mes.message = messages.serverError;
  }
  return res.status(statusCode).json({ success: false, ...mes });
};

module.exports = { success, error };
