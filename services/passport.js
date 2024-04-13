const config = require("./../api/config");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./../api/v1/models/User");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const mail = require("./../services/mail");
const messages = require("../utils/messages");
const crypto = require("../utils/crypto");

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      const { name, mobile, userType } = req.body;
      try {
        const user = await User.findOne({
          where: { [Op.or]: [{ email: email }, { username: mobile }] },
        });
        if (user) {
          if (user.email === email)
            return done(null, false, {
              errors: { email: "Email is already exists" },
            });
          else
            return done(null, false, {
              errors: { mobile: "Mobile is already exists" },
            });
        }

        const pass = await bcrypt.hash(password.toString(), 10);
        const newUser = await User.create({
          usertype: userType,
          name: name,
          email: email,
          username: mobile,
          password: pass,
        });

        await mail.verifyAccount(newUser.email, newUser.id, newUser.name);

        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "mobile",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, mobile, password, done) {
      // const { userType } = req.body;
      try {
        const user = await User.findOne({
          where: { user_name: mobile },
          attributes: [
            "email",
            "password",
            "user_name",
            "name",
            "id",
            "role_type",
            "token",
          ],
        });
        if (!user || !["ibp", "staff", "Admin"].includes(user.role_type)) {
          return done(null, false, { errors: { mobile: "Invalid mobile" } });
        }
        /*     if (!user.isVerified) {
          return done(null, false, {
            errors: { mobile: messages.mobileNotverify },
          });
        } */
        /* const match = await bcrypt.compare(
          password.toString(),
          user.password || ""
        ); */
        const match = user.password == crypto.md5(password);
        if (!match) {
          return done(null, false, {
            errors: { password: "Invalid password" },
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT,
      clientSecret: config.GOOGLE_SECRET,
      callbackURL: config.GOOGLE_CALLBACK,
      scope: ["profile", "email"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (!user) {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            isVerified: true,
            google: "Y",
          });
          return done(null, newUser);
        } else return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_ID,
      clientSecret: config.FACEBOOK_SECRET,
      callbackURL: config.FACEBOOK_CALLBACK,
      profileFields: ["id", "displayName", "emails"],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (!user) {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            isVerified: true,
            facebook: "Y",
          });
          return done(null, newUser);
        } else return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findOne({
    where: { id: id },
    attributes: [
      "email",
      "password",
      "user_name",
      "name",
      "id",
      "role_type",
      "token",
    ],
  });
  if (user) {
    done(null, user);
  } else {
    done(null, null);
  }
});
