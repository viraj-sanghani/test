const { DataTypes } = require("sequelize");
const { sequelize } = require("../../database");

const PropertyImage = sequelize.define(
  "propertyImage_hm",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    propertyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    label: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  { tableName: "property_images_hm", timestamps: false }
);

sequelize
  .sync()
  .then(() => {})
  .catch((err) => {
    console.error("Error creating table:", err);
  });

module.exports = PropertyImage;
