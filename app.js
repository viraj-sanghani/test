const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const routes = require("./api");
const { sequelize } = require("./api/database");

const app = express();
const allowedDomains = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://d35.vvelocity.com",
  "https://d35.vvelocity.com",
  "https://d116.vvelocity.com",
  "flutter-app://com.dreamhome.app",
];

app.use(morgan("dev"));
app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 20000,
  })
);
app.use(
  cors({
    credentials: true,
    origin: allowedDomains,
    methods: "GET, POST, PUT, DELETE",
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: "aCUUJkEIe6sU8urSmx5jTNxdtFwgCF0rbUpXnLk1NmBZNw",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  /* const requestDomain = req.get("Origin");
  if (allowedDomains.includes(requestDomain)) {
    next();
  } else {
    res.sendStatus(403);
  } */
  next();
});

app.use("/api/", routes);

const closeServer = () => {
  console.log("Shutting down...");
  sequelize.close();
  process.exit(0);
};

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  closeServer();
});
process.on("SIGINT", closeServer); // Ctrl+C in terminal
process.on("SIGTERM", closeServer); // Kill signal

module.exports = app;
