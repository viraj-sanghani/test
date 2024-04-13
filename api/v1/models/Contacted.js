const { DataTypes } = require("sequelize");
const { sequelize } = require("./../../database");

const Contacted = sequelize.define(
  "contacted_hm",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
    },
    reasonToBuy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      default: null,
    },
    isDealer: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    planningToBuy: {
      type: DataTypes.STRING(50),
      allowNull: true,
      default: null,
    },
    homeLoan: {
      type: DataTypes.STRING(10),
      allowNull: true,
      default: null,
    },
    siteVisit: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  { timestamps: false }
);

sequelize
  .sync()
  .then(() => {})
  .catch((err) => {
    console.error("Error creating table:", err);
  });

module.exports = Contacted;
