const { DataTypes } = require("sequelize");
const { sequelize } = require("./../../database");

const Viewed = sequelize.define("viewed_hm", {
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

sequelize
  .sync()
  .then(() => {})
  .catch((err) => {
    console.error("Error creating table:", err);
  });

module.exports = Viewed;
