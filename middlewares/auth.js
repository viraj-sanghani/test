const messages = require("./../utils/messages");
const User = require("../api/v1/models/User");

const validAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const user = await User.findByToken(token);
      if (user) {
        req.userId = user.id;
        req.userType = user.role_type;
        req.ibpId = user.ibpid;
        return next();
      }
    }
  } catch (err) {}
  return res.status(401).json({
    success: false,
    message: messages.wrongToken,
  });
};

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const user = await User.findByToken(token);
      if (user) {
        req.userId = user.id;
        req.userType = user.role_type;
        req.ibpId = user.ibpid;
      }
    }
  } catch (error) {}
  next();
};

const validStaff = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      const user = await User.findByToken(token);
      if (user && user.role_type === "staff") {
        req.userId = user.id;
        req.userType = user.role_type;
        req.ibpId = user.ibpid;
        return next();
      }
    }
  } catch (err) {}
  return res.status(401).json({
    success: false,
    message: messages.wrongToken,
  });
};

module.exports = { validAuth, verifyAuth, validStaff };
