const passport = require("passport");
const config = require("./../../config");
require("./../../../services/passport");
const User = require("./../models/User");
const { success, error } = require("./../../../utils/response");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mail = require("./../../../services/mail");
const messages = require("./../../../utils/messages");

const auth = {};

const redirect = {
  failureRedirect: config.LOGIN_FAIL,
  // successRedirect: config.LOGIN_SUCCESS,
};

auth.verify = (req, res) => {
  return success(res, 200);
};

auth.logout = (req, res) => {
  req.session = null;
  return success(res, 200, {
    message: messages.logoutSuccess,
  });
};

auth.localRegister = (req, res, next) => {
  passport.authenticate("local.signup", (err, user, info) => {
    if (err) throw err;
    if (user) {
      return success(res, 200, {
        message: messages.registerSuccess,
      });
    }
    info && error(res, 400, { errors: info.errors });
  })(req, res, next);
};

auth.accountVerify = async (req, res) => {
  try {
    const token = jwt.verify(req.body?.token, config.JWT_SECRET);
    const user = await User.findOne({
      where: { id: token?.id },
    });

    if (!user || user.isVerified)
      return error(res, 400, { message: messages.linkExpired });

    await user.update({ set: { isVerified: true }, where: { id: token?.id } });

    return success(res, 200);
  } catch (err) {
    return error(res, err?.message ? 400 : 500, {
      message: err?.message,
    });
  }
};

auth.localLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (user) {
      req.login(user, async (err) => {
        if (err) {
          return error(res, 400);
        }
        /* const token = jwt.sign(
          { userId: user.id, userType: user.role_type },
          config.JWT_SECRET,
          {
            expiresIn: "30d",
          }
        ); */

        const userData = Object.keys(req.user).reduce((object, key) => {
          if (!["password"].includes(key)) {
            object[key] = req.user[key];
          }
          return object;
        }, {});

        let token = "";

        if (user.id == 42) {
          token = userData.token;
        } else {
          token = `${Math.floor(
            Math.random() * 100000
          )}${Date.now().toString()}`;
          await User.update({ set: { token: token }, where: { id: user.id } });
        }

        delete userData.token;

        return success(res, 200, {
          message: messages.loginSuccess,
          data: {
            ...userData,
            username: req.user?.user_name,
            usertype: req.user?.role_type,
          },
          token,
        });
      });
    }
    info && error(res, 400, { errors: info.errors });
  })(req, res, next);
};

auth.googleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

auth.googleCallback = (req, res, next) => {
  passport.authenticate("google", redirect, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(redirect.failureRedirect);
    const token = jwt.sign(
      { userId: user.id, userType: user.usertype },
      config.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.redirect(`${config.LOGIN_SUCCESS}/${token}`);
  })(req, res, next);
};

auth.facebookLogin = (req, res, next) => {
  passport.authenticate("facebook")(req, res, next);
};

auth.facebookCallback = (req, res, next) => {
  passport.authenticate("facebook", redirect, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(redirect.failureRedirect);
    const token = jwt.sign(
      { userId: user.id, userType: user.usertype },
      config.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.redirect(`${config.LOGIN_SUCCESS}/${token}`);
  })(req, res, next);
};

auth.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: { email: email },
    });
    if (!user)
      return error(res, 400, { errors: { email: messages.userNotExists } });

    const token = await mail.resetPassword(
      email,
      user.id,
      user.name,
      config.RESET_VALID_TIME
    );

    await user.update({ otp: token });

    return success(res, 200, {
      message: messages.forgotLinkSend,
    });
  } catch (err) {
    return error(res, 500);
  }
};

auth.resetPassword = async (req, res) => {
  try {
    const newPassword = req.body.password;
    const token = jwt.verify(req.body.token, config.JWT_SECRET);
    const user = await User.findOne({
      where: { id: token?.id || 0 },
    });

    let checkPassword = await bcrypt.compare(
      newPassword.toString(),
      user.password || ""
    );
    if (checkPassword)
      return error(res, 400, {
        errors: {
          password: messages.invalidNewPass,
        },
      });

    if (!user)
      return error(res, 400, { errors: { email: messages.userNotFound } });

    let timeDiff = (new Date() - token.time) / 60000;
    if (timeDiff > config.RESET_VALID_TIME || user.otp != token.forgotToken)
      return error(res, 400, { errors: { token: messages.linkExpired } });

    const pass = await bcrypt.hash(newPassword.toString(), 10);
    await user.update({
      password: pass,
      otp: null,
    });

    return success(res, 200, {
      message: messages.resetSuccess,
    });
  } catch (err) {
    return error(res, err?.message ? 400 : 500, {
      message: err?.message,
    });
  }
};

auth.forgotVerify = async (req, res) => {
  try {
    const token = jwt.verify(req.body?.token, config.JWT_SECRET);
    const user = await User.findOne({
      where: { id: token?.id || 0 },
    });

    let timeDiff = (new Date() - token.time) / 60000;
    if (
      !user ||
      timeDiff > config.RESET_VALID_TIME ||
      user.otp != token.forgotToken
    )
      return error(res, 400, { message: messages.linkExpired });

    return success(res, 200);
  } catch (err) {
    return error(res, err?.message ? 400 : 500, {
      message: err?.message,
    });
  }
};

auth.changePassword = async (req, res) => {
  const { oldPass, newPass } = req.body;

  if (oldPass == newPass)
    return error(res, 400, {
      errors: {
        newPass: messages.invalidNewPass,
      },
    });

  try {
    const user = await User.findOne({
      where: { id: req.userId },
    });

    let checkPassword = await bcrypt.compare(oldPass, user.password || "");
    if (!checkPassword)
      return error(res, 400, {
        errors: {
          oldPass: messages.wrongOldPass,
        },
      });

    const pass = await bcrypt.hash(newPass.toString(), 10);
    await user.update({ set: { password: pass }, where: { id: req.userId } });

    return success(res, 200, {
      message: messages.passChangeSuccess,
    });
  } catch (err) {
    return error(res, err?.message ? 400 : 500, {
      message: err?.message,
    });
  }
};

auth.userProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.userId },
      attributes: ["id", "name", "email", "user_name", "role_type"],
    });

    return success(res, 200, {
      data: user,
    });
  } catch (err) {
    return error(res, err?.message ? 400 : 500, {
      message: err?.message,
    });
  }
};

auth.updateUser = async (req, res) => {
  const { name, email, userType } = req.body;
  try {
    await User.update({
      set: {
        name,
        email: email,
        role_type: userType,
      },
      where: { id: req.userId },
    });

    const user = await User.findOne({
      where: { id: req.userId },
      attributes: ["id", "name", "email", "user_name", "role_type"],
    });

    /* const token = jwt.sign(
      { userId: req.userId, userType: user.usertype },
      config.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    ); */

    const token = `${Math.floor(
      Math.random() * 100000
    )}${Date.now().toString()}`;

    await User.update({ set: { token: token }, where: { id: req.userId } });

    return success(res, 200, {
      message: messages.detailsSaved,
      data: {
        ...user.dataValues,
        username: req.user?.user_name,
        usertype: user.dataValues.role_type,
        token,
      },
    });
  } catch (err) {
    return error(res, 500);
  }
};

module.exports = auth;
