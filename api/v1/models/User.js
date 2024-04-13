const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("./../../database");

/* const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(20),
      defaultValue: null,
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    confirm_pswd: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    otp: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    usertype: {
      type: DataTypes.ENUM("Owner", "Builder", "Customer", "Channel Partner"),
      defaultValue: null,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
    facebook: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "N",
    },
    google: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "N",
    },
    date_time: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  { tableName: "user", timestamps: false }
); */

/* sequelize
  .sync()
  .then(() => {})
  .catch((err) => {
    console.error("Error creating table:", err);
  }); */

const User = {
  findOne: (data) =>
    new Promise(async (resolve) => {
      try {
        let values = [];
        let attributes = [];

        if (data?.where) {
          for (const [key, val] of Object.entries(data.where)) {
            values.push(`${key} = '${val}'`);
          }
        }

        if (data?.attributes) {
          if (Array.isArray(data?.attributes)) {
            attributes = data?.attributes;
          } else {
            attributes = data.attributes.exclude;
          }
        }

        const fields = attributes.length > 0 ? attributes.join(",") : "*";

        const qry = await sequelize.query(
          `SELECT ${fields} FROM user ${data?.where ? "WHERE" : ""}
        ${values.join(" AND ")}`,
          {
            type: Sequelize.QueryTypes.SELECT,
          }
        );
        resolve(qry[0] ? qry[0] : null);
      } catch (err) {
        resolve(null);
      }
    }),
  update: (data) =>
    new Promise(async (resolve, reject) => {
      try {
        let values = [];
        let set = [];

        if (data?.set) {
          for (const [key, val] of Object.entries(data.set)) {
            set.push(`${key} = '${val}'`);
          }
        }

        if (data?.where) {
          for (const [key, val] of Object.entries(data.where)) {
            values.push(`${key} = '${val}'`);
          }
        }

        const qry = await sequelize.query(
          `UPDATE user SET ${set.join(",")} ${data?.where ? "WHERE" : ""}
            ${values.join(",")}`,
          {
            type: Sequelize.QueryTypes.UPDATE,
          }
        );
        resolve();
      } catch (err) {
        reject();
      }
    }),
  findByToken: (token) =>
    new Promise(async (resolve) => {
      try {
        const qry = await sequelize.query(
          `SELECT id, role_type, ibpid FROM user WHERE token = ?`,
          {
            replacements: [token],
            type: Sequelize.QueryTypes.SELECT,
          }
        );
        resolve(qry[0] ? qry[0] : null);
      } catch (err) {
        resolve(null);
      }
    }),
};

module.exports = User;
