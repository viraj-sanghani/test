const Sequelize = require("sequelize");
const config = require("./config");

const sequelize = new Sequelize(
  config.DATABASE.NAME,
  config.DATABASE.USER,
  config.DATABASE.PASSWORD,
  {
    host: config.DATABASE.HOST,
    dialect: "mysql",
    logging: false,
    timezone: "+05:30",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

module.exports = { sequelize };
