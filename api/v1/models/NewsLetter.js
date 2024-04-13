const { DataTypes } = require("sequelize");
const { sequelize } = require("../../database");

const NewsLetter = sequelize.define(
  "newsLetter_hm",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

module.exports = NewsLetter;
