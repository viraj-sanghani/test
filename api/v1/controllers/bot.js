const { Sequelize } = require("sequelize");
const { error, success } = require("./../../../utils/response");
const { sequelize } = require("../../database");
const { hideMobileNumber, hideEmailAddress } = require("../../../utils/common");
const { propertyCardFields } = require("../../../utils/data");

const bot = {};

const price = {
  "0 - 10L": {
    min: 0,
    max: 1000000,
  },
  "10L - 20L": {
    min: 1000000,
    max: 2000000,
  },
  "20L - 30L": {
    min: 2000000,
    max: 3000000,
  },
  "30L - 40L": {
    min: 3000000,
    max: 4000000,
  },
  "40L - 50L": {
    min: 4000000,
    max: 5000000,
  },
  "50L - 60L": {
    min: 5000000,
    max: 6000000,
  },
  "60L - 70L": {
    min: 6000000,
    max: 7000000,
  },
  "70L - 80L": {
    min: 7000000,
    max: 8000000,
  },
  "80L - 90L": {
    min: 8000000,
    max: 9000000,
  },
  "90L - 1cr": {
    min: 9000000,
    max: 10000000,
  },
  "1cr - 1.25cr": {
    min: 10000000,
    max: 12500000,
  },
  "1.25cr - 1.50cr": {
    min: 12500000,
    max: 15000000,
  },
  "1.50cr - 1.75cr": {
    min: 15000000,
    max: 17500000,
  },
  "1.75cr - 2cr": {
    min: 17500000,
    max: 20000000,
  },
  "2cr - 2.25cr": {
    min: 20000000,
    max: 22500000,
  },
  "2.25cr - 2.50cr": {
    min: 22500000,
    max: 25000000,
  },
  "2.50cr - 5cr": {
    min: 25000000,
    max: 50000000,
  },
  "5cr+": {
    min: 50000000,
  },
};

const propertyTypes = [
  "Flat/Apartment",
  "Residential House",
  "Residential Land/Plot",
  "Penthouse",
  "Builder Floor Apartment",
  "Villa",
  "Studio Apartment",
  "Farm House",
  "Service Apartment",
];

bot.properties = async (req, res) => {
  const { userType } = req;

  let qry = "p.status = ?";
  const values = ["Y"];

  if (userType !== "Channel Partner") {
    qry += " AND p.postFor IN ('', 'B2C')";
  } else {
    qry += " AND p.postFor NOT IN ('Self')";
  }

  try {
    const { type, city, bhk, budget, for: forr } = req.body;

    if (forr) {
      if (forr === "sale") {
        qry += " AND p.forr = ?";
        values.push("Sale");
      } else if (forr === "rent") {
        qry += " AND p.forr = ?";
        values.push("Rent/Lease");
      }
    }

    if (city) {
      qry += " AND p.city = ?";
      values.push(city);
    }

    if (type) {
      qry += " AND p.property_type = ?";
      values.push(type);
    }

    if (bhk && propertyTypes.includes(type)) {
      const bedroom = bhk.split(" ")[0];
      qry += " AND p.bedroom = ?";
      values.push(bedroom);
    }

    if (budget) {
      const { min, max } = price[budget];
      if (max) {
        qry += " AND p.exp_price <= ?";
        values.push(max);
      }
      if (min) {
        qry += " AND p.exp_price >= ?";
        values.push(min);
      }
    }

    qry += " AND p.status = 'Y' AND p.isActive = 1 AND p.isDeleted = 0";

    let mainQry = qry + " GROUP BY p.id";

    values.push(20);
    values.push(0);

    let data = await sequelize.query(
      `SELECT p.id as id, p.forr, p.name, p.email, p.mobile, p.date, ${propertyCardFields}, pi.file as image 
      FROM post_sale_property_hm p
      LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
      WHERE ${mainQry} LIMIT ? OFFSET ?`,
      {
        replacements: values,
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    data.forEach((ele) => {
      ele.mobile = hideMobileNumber(ele?.mobile || "");
      ele.email = hideEmailAddress(ele?.email || "");
    });

    return success(res, 200, { data });
  } catch (err) {
    return error(res, 500);
  }
};

module.exports = bot;
