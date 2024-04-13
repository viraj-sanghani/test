const { DataTypes } = require("sequelize");
const { sequelize } = require("./../../database");

const PropertyRequirement = sequelize.define(
  "post_requirement_hm1",
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
    ibpId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      default: null,
    },
    email: {
      type: DataTypes.STRING,
      default: null,
    },
    mobile: {
      type: DataTypes.STRING(15),
      default: null,
    },
    alternatemobile: {
      type: DataTypes.STRING(15),
      default: null,
    },
    currentaddress: {
      type: DataTypes.STRING,
      default: null,
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    locality: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    postFor: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    property_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    property_for: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bedrooms: {
      type: DataTypes.STRING(50),
      default: null,
    },
    lookingFor: {
      type: DataTypes.STRING(50),
      default: null,
    },
    floor: {
      type: DataTypes.STRING(50),
      default: null,
    },
    parking: {
      type: DataTypes.STRING(50),
      default: null,
    },
    balcony: {
      type: DataTypes.STRING(50),
      default: null,
    },
    community: {
      type: DataTypes.STRING(50),
      default: null,
    },
    furnish_status: {
      type: DataTypes.STRING(50),
      default: null,
    },
    meeting: {
      type: DataTypes.STRING(50),
      default: null,
    },
    buildingType: {
      type: DataTypes.STRING(50),
      default: null,
    },
    connectivity: {
      type: DataTypes.STRING,
      default: null,
    },
    within2km: {
      type: DataTypes.STRING,
      default: null,
    },
    within5km: {
      type: DataTypes.STRING,
      default: null,
    },
    within10km: {
      type: DataTypes.STRING,
      default: null,
    },
    nearByLocation1: {
      type: DataTypes.STRING(50),
      default: null,
    },
    nearByLocation2: {
      type: DataTypes.STRING(50),
      default: null,
    },
    nearByLocation3: {
      type: DataTypes.STRING(50),
      default: null,
    },
    nearByLocation4: {
      type: DataTypes.STRING(50),
      default: null,
    },
    amenities: {
      type: DataTypes.STRING(50),
      default: null,
    },
    budget_min: {
      type: DataTypes.BIGINT(15),
      allowNull: false,
    },
    budget_max: {
      type: DataTypes.BIGINT(15),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      default: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      default: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      default: null,
    },
  },
  { tableName: "post_requirement_hm1" }
);

sequelize
  .sync()
  .then(() => {})
  .catch((err) => {
    console.error("Error creating table:", err);
  });

module.exports = PropertyRequirement;
