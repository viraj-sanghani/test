const { success, error } = require("./../../../utils/response");
const Locality = require("./../models/Locality");
const City = require("./../models/City");
const { Op, Sequelize } = require("sequelize");
const { sequelize } = require("./../../database");
const { hideMobileNumber, hideEmailAddress } = require("../../../utils/common");
const {
  propertyCardFields,
  keyValues,
  getFilterFields,
  getFilterData,
  sortList,
} = require("../../../utils/data");

const sortValue = {
  rlv: "p.id ASC",
  nf: "p.id DESC",
  lth: "p.exp_price ASC",
  htl: "p.exp_price DESC",
};

const search = {};

search.getFilters = (req, res) => {
  const { forr, type } = req.body;

  if (!forr) return error(res, 400, { message: "Please provide forr value" });
  if (!type) return error(res, 400, { message: "Please provide type value" });

  const fields = getFilterFields(forr, type);

  const filters = getFilterData(forr, type).filter((ele) =>
    fields.includes(ele.key)
  );

  return success(res, 200, { filters, sort: sortList });
};

search.suggest = async (req, res) => {
  try {
    let str = `%${req.body.term}%`;

    // check project name

    /* const project = await sequelize.query(
      `SELECT project_name as title FROM post_sale_property 
      WHERE project_name like ? LIMIT 15`,
      {
        replacements: [str],
        type: Sequelize.QueryTypes.SELECT,
      }
    ); */

    // check locality

    const locality = await Locality.findAll({
      where: {
        locality: {
          [Op.like]: str,
        },
      },
      limit: 15,
      attributes: ["id", "city_id", "locality", "city_name"],
    });

    // check city

    const city = await City.findAll({
      where: {
        city: {
          [Op.like]: str,
        },
      },
      limit: 15,
      attributes: ["id", "city"],
    });

    const data = [
      /* ...project.map((ele) => {
        return {
          title: ele.title,
          type: "project",
        };
      }), */
      ...locality.map((ele) => {
        return {
          title: `${ele.locality}, ${ele.city_name}`,
          id: ele.id,
          city_id: ele.city_id,
          type: "locality",
        };
      }),
      ...city.map((ele) => {
        return {
          title: ele.city,
          id: ele.id,
          type: "city",
        };
      }),
    ];

    return success(res, 200, {
      data,
    });
  } catch (err) {
    console.log(err);
    return error(res, 500);
  }
};

search.filter = async (req, res) => {
  const userId = req?.userId || 0;
  const ibpId = req?.ibpId || 0;
  const userType = req?.userType;

  let qry = "";
  const values = [];

  if (userType === "staff") {
    qry = "p.status IN ('Y', 'N') AND p.isActive IN (1, 0) AND p.isDeleted = 0";
  } else {
    qry += "p.status = 'Y' AND p.isActive = 1 AND p.isDeleted = 0";
    if (!["Channel Partner", "ibp"].includes(userType)) {
      qry += " AND p.postFor IN ('', 'B2C')";
    } else {
      qry += " AND p.postFor IN ('Community', 'CP')";
    }
  }

  try {
    const {
      forr,
      type,
      locality,
      city,
      hideSeen,
      propertyType,
      bedRoom,
      constructionStatus,
      // postBy,
      purchaseType,
      furnishing,
      budget,
      area,
      page,
      sort,
      lat,
      lng,
      radius,
      user,
      staff,
    } = req.body;

    const hideViewed = hideSeen && userId;

    if (lat && lng) {
      const within = radius ? Number(radius) : 5;
      qry +=
        " AND (6371 * ACOS(COS(RADIANS(p.latitude)) * COS(RADIANS(?)) * COS(RADIANS(?) - RADIANS(p.longitude)) + SIN(RADIANS(p.latitude)) * SIN(RADIANS(?)) ) ) <= ?";
      values.push(lat, lng, lat, within);
    } else {
      if (Array.isArray(locality) && locality[0]) {
        const locRes = await Locality.findAll({
          where: {
            id: locality,
          },
          attributes: ["locality"],
        });
        const lty = locRes.map((ele) => ele.locality);

        if (lty.length > 0) {
          qry += " AND p.locality in (?)";
          values.push(lty);
        }
      }

      if (city && city != "all") {
        const cityRes = await City.findAll({
          where: {
            id: city,
          },
          attributes: ["city"],
        });

        if (cityRes.length > 0) {
          qry += " AND p.city = ?";
          values.push(cityRes[0]?.city);
        }
      }
    }

    if (user && user != "all") {
      qry += " AND p.user_id = ?";
      values.push(user);
    }

    if (staff && staff != "all") {
      qry += " AND p.created_by = ?";
      values.push(staff);
    }

    if (Array.isArray(propertyType) && propertyType[0]) {
      qry += " AND p.property_type in (?)";
      values.push(propertyType.map((ele) => keyValues.propertyType[ele]));
    }

    if (forr) {
      if (forr === "sale" || forr === "buy") {
        qry += " AND p.forr = ?";
        values.push("Sale");
      } else if (forr === "rent") {
        qry += " AND p.forr = ?";
        values.push("Rent/Lease");
      }
    }

    if (type) {
      if (type === "residential") {
        qry += " AND p.property_type in (?)";
        values.push([
          "Flat/Apartment",
          "Residential House",
          "Villa",
          "Builder Floor Apartment",
          "Residential Land/Plot",
          "Penthouse",
          "Studio Apartment",
          "Service Apartment",
          "Farm House",
        ]);
      } else if (type === "commercial") {
        qry += " AND p.property_type in (?)";
        values.push([
          "Commercial Office Space",
          "Office in IT Park/SEZ",
          "Commercial Shop",
          "Commercial Showroom",
          "Commercial Land",
          "Warehouse/Godown",
          "Industrial Land",
          "Industrial Building",
          "Industrial Shed",
          "Agricultural Land",
        ]);
      } else if (type === "plots/land" || type === "plots-land") {
        qry += " AND p.property_type in (?)";
        values.push([
          "Residential Land/Plot",
          "Commercial Land",
          "Industrial Land",
          "Agricultural Land",
        ]);
      }
    }

    if (Array.isArray(bedRoom) && bedRoom[0]) {
      if (bedRoom.includes("7+")) {
        let bed = bedRoom.filter((ele) => ele != "7+");
        if (bed.length == 0) {
          qry += " AND p.bedroom > 7";
        } else {
          qry += " AND p.bedroom in (?) OR p.bedroom > 7";
          values.push(bed);
        }
      } else {
        qry += " AND p.bedroom in (?)";
        values.push(bedRoom);
      }
    }

    if (Array.isArray(constructionStatus) && constructionStatus[0]) {
      qry += " AND p.prop_availability in (?)";
      values.push(
        constructionStatus.map((ele) => keyValues.constructionStatus[ele])
      );
    }

    /* if (Array.isArray(postBy) && postBy[0]) {
      qry += " AND p.iam in (?)";
      values.push(postBy.map((ele) => keyValues.postBy[ele]));
    } */

    if (Array.isArray(purchaseType) && purchaseType[0]) {
      qry += " AND p.transaction_type in (?)";
      values.push(purchaseType);
    }

    if (Array.isArray(furnishing) && furnishing[0]) {
      qry += " AND p.furnish_status in (?)";
      values.push(furnishing.map((ele) => keyValues.furnishing[ele]));
    }

    if (budget) {
      const col = forr === "rent" ? "p.monthly_rent" : "p.exp_price";
      if (budget?.min) {
        qry += ` AND ${col} >= ?`;
        values.push(budget.min);
      }
      if (budget?.max) {
        qry += ` AND ${col} <= ?`;
        values.push(budget.max);
      }
    }

    if (area) {
      if (area?.min) {
        qry += ` AND p.carpet_area >= ?`;
        values.push(area.min);
      }
      if (area?.max) {
        qry += ` AND p.carpet_area <= ?`;
        values.push(area.max);
      }
    }

    if (hideViewed) {
      qry += " AND v.propertyId IS NULL";
    }

    let mainQry = qry + " GROUP BY p.id";

    if (sort) {
      mainQry += ` ORDER BY ${sortValue[sort]}`;
    } else {
      mainQry += " ORDER BY p.id DESC";
    }

    values.push(20);
    values.push((page || 0) * 20);

    const data = {};

    data.data = await sequelize.query(
      `SELECT p.id as id, p.forr, p.date, p.latitude, p.longitude, ${propertyCardFields}, pi.file as img, u.name, u.email, u.user_name as mobile, 
      CASE WHEN sh.propertyId IS NOT NULL THEN 1 ELSE 0 END AS isShortlisted
      FROM post_sale_property_hm p
      LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
      LEFT JOIN user u ON p.ibpId = u.ibpid AND u.sub_role IS NULL 
      LEFT JOIN shortlisteds_hm sh ON p.id = sh.propertyId AND sh.userId = ?
      ${
        hideViewed
          ? `LEFT JOIN vieweds_hm v ON p.id = v.propertyId AND v.userId = ${userId}`
          : ""
      }
      WHERE ${mainQry} LIMIT ? OFFSET ?`,
      {
        replacements: [userId, ...values],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    /* data.data.forEach((ele) => {
      ele.mobile = ele?.mobile
        ? hideMobileNumber(ele?.mobile || "")
        : ele?.mobile;
      ele.email = ele?.email ? hideEmailAddress(ele?.email || "") : ele?.email;
    }); */

    if (!page || page == 0) {
      const res = await sequelize.query(
        `SELECT count(p.id) as total FROM post_sale_property_hm as p
        ${
          hideViewed
            ? `LEFT JOIN vieweds_hm v ON p.id = v.propertyId AND v.userId = ${userId}`
            : ""
        }
        WHERE ${qry}`,
        {
          replacements: values,
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      data.total = res[0].total;
    }

    return success(res, 200, data);
  } catch (err) {
    console.log(err);
    return error(res, 500);
  }
};

module.exports = search;
