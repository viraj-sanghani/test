const { DataTypes } = require("sequelize");
const { sequelize } = require("../../database");

const PropertyShared = sequelize.define(
  "property_shared_hm",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  { tableName: "property_shared_hm", timestamps: false }
);

sequelize
  .sync()
  .then(() => {})
  .catch((err) => {
    console.error("Error creating table:", err);
  });

module.exports = PropertyShared;
