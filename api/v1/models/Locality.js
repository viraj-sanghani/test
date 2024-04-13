const { DataTypes } = require("sequelize");
const { sequelize } = require("./../../database");

const Locality = sequelize.define(
  "locality_hm",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    locality: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    city_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    city_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  { tableName: "locality_hm", timestamps: false }
);

sequelize
  .sync()
  .then(() => {})
  .catch((err) => {
    console.error("Error creating table:", err);
  });

module.exports = Locality;
