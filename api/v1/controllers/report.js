const { success, error } = require("./../../../utils/response");
const { sequelize } = require("../../database");
const { Sequelize } = require("sequelize");

const report = {};

report.userListings = async (req, res) => {
  const { locality, cpId, postFor, forr } = req.body;
  const keys = [];
  const keys1 = [];
  const values = [];

  if (locality) {
    keys.push(`p.locality in (?)`);
    keys1.push(`r.locality in (?)`);
    values.push(locality.split(","));
  }
  /* if (cpId) {
    keys.push(`p.user_id in (?)`);
    keys1.push(`r.userId in (?)`);
    values.push(cpId.split(","));
  } */
  if (postFor) {
    keys.push(`p.postFor in (?)`);
    keys1.push(`r.postFor in (?)`);
    values.push(postFor.split(","));
  }
  if (forr) {
    keys.push(`p.forr in (?)`);
    keys1.push(`r.property_for in (?)`);
    const f = forr.split(",");
    values.push(f.includes("Sale") ? ["Buy", ...f] : f);
  }

  const qry = keys.length > 0 ? `AND ${keys.join(" AND ")}` : "";
  const qry1 = keys1.length > 0 ? `AND ${keys1.join(" AND ")}` : "";

  try {
    const data = await sequelize.query(
      `SELECT u.id as userId, u.name, u.user_name as mobile, u.email, COUNT(DISTINCT p.id) AS properties , COUNT(DISTINCT r.id) AS requirements from user u 
        LEFT JOIN post_sale_property_hm p ON u.id = p.user_id ${qry}
        LEFT JOIN post_requirement_hm1 r ON u.id = r.userId ${qry1}
        ${cpId ? "WHERE u.id in (?)" : ""}
        GROUP BY u.id`,
      {
        replacements: [...values, ...values, cpId ? cpId.split(",") : ""],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return success(res, 200, {
      data,
    });
  } catch (err) {
    return error(res, 500);
  }
};

module.exports = report;
