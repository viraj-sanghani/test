const { Sequelize, Op } = require("sequelize");
const { sequelize } = require("./../../database");
const City = require("../models/City");
const Locality = require("../models/Locality");
const PropertyRequirement = require("../models/PropertyRequirement");
const { success, error } = require("./../../../utils/response");
const {
  requirementFormData,
  keyValues,
  getRequirmentFilterData,
  hideRequirementFields,
} = require("../../../utils/data");
const messages = require("../../../utils/messages");

const requirement = {};

const checkRequirementExist = async (
  requirementId,
  userId,
  ibpId,
  userType
) => {
  try {
    let conditions = "";
    const isStaff = userType === "staff";

    if (isStaff) {
      conditions = "id = ?";
    } else {
      conditions = "id = ? AND (userId = ? OR ibpId = ?)";
    }

    const result = await sequelize.query(
      `SELECT id FROM post_requirement_hm1 WHERE ${conditions} AND isDeleted = 0`,
      {
        replacements: isStaff
          ? [requirementId]
          : [requirementId, userId, ibpId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (result[0]) {
      return true;
    }
  } catch (err) {}
  return false;
};

requirement.getRequirementForm = (req, res) => {
  try {
    return success(res, 200, { data: requirementFormData });
  } catch (err) {
    return error(res, 500);
  }
};

requirement.getRequirementFields = (req, res) => {
  try {
    const { propertyType, propertyFor } = req.body;
    if (!propertyType)
      return error(res, 400, { message: "Property type is required" });
    if (!propertyFor)
      return error(res, 400, { message: "Property for is required" });
    const data = [];
    Object.entries(hideRequirementFields).forEach((ele) => {
      if (
        (ele[0] !== "lookingFor" || propertyFor.toLowerCase() !== "rent") &&
        !ele[1].includes(propertyType)
      )
        data.push(ele[0]);
    });
    return success(res, 200, { data: data });
  } catch (err) {
    return error(res, 500);
  }
};

requirement.getRequirmentFilter = (req, res) => {
  try {
    const { type, for: forr } = req.body;
    if (!forr) return error(res, 400, { message: "For is required" });
    if (!type) return error(res, 400, { message: "Type is required" });

    if (!["buy", "rent"].includes(forr))
      return error(res, 400, { message: "Invalid For" });
    if (!["residential", "commercial", "plots-land"].includes(type))
      return error(res, 400, { message: "Invalid Type" });

    const invalidFields = {
      residential: [],
      commercial: ["bedRoom"],
      "plots-land": [],
    };

    const data = getRequirmentFilterData(forr, type);
    return success(res, 200, {
      data: data.filter((ele) => !invalidFields[type].includes(ele.key)),
    });
  } catch (err) {
    return error(res, 500);
  }
};

requirement.myRequirement = async (req, res) => {
  const userId = req.userId;
  const ibpId = req.ibpId;
  const sort =
    req.body?.sort && ["asc", "desc"].includes(req.body.sort)
      ? req.body.sort
      : "desc";

  try {
    const data = await PropertyRequirement.findAll({
      attributes: { exclude: ["isDeleted", "deletedAt"] },
      where: { [Op.or]: { userId: userId, ibpId: ibpId }, isDeleted: 0 },
      order: [["id", sort]],
    });

    return success(res, 200, { data });
  } catch (err) {
    return error(res, 500);
  }
};

requirement.addRequirement = async (req, res) => {
  try {
    const data = req.body;
    let requirementId = data?.requirementId;
    const userId = req?.userId || 0;
    const ibpId = req?.ibpId || 0;
    const userType = req?.userType || "";
    const CP_ID = userType === "staff" ? data?.cp_id || "" : "";

    delete data.cp_id;
    delete data?.requirementId;

    const requirementData = await PropertyRequirement.findOne({
      where: {
        [Op.or]: [{ userId: userId }, { ibpId: ibpId }],
        id: requirementId || 0,
      },
    });

    const val = {};
    for (const [key, value] of Object.entries(data)) {
      val[key] = Array.isArray(value) ? value.join(", ") : value;
    }

    if (requirementData) {
      await PropertyRequirement.update(val, { where: { id: requirementId } });
    } else {
      val["ibpId"] = ibpId;
      if (CP_ID) {
        val["userId"] = CP_ID;
        val["created_by"] = req.userId;
      } else {
        val["userId"] = req.userId;
      }
      const result = await PropertyRequirement.create(val);
      requirementId = result.id;
    }
    return success(res, 200, {
      message: messages.requirementPost,
      requirementId,
    });
  } catch (err) {
    return error(res, 500);
  }
};

requirement.editRequirementInfo = async (req, res) => {
  const { requirementId } = req.params;
  const userId = req.userId;
  const ibpId = req.ibpId;
  const userType = req?.userType || "";
  const isStaff = userType === "staff";

  try {
    const conditions = { id: requirementId, isDeleted: 0 };

    const data = await PropertyRequirement.findOne({
      attributes: { exclude: ["isVerified", "isDeleted", "deletedAt"] },
      where: isStaff
        ? conditions
        : {
            ...conditions,
            [Op.or]: { userId: userId, ibpId: ibpId },
          },
    });

    if (data) {
      return success(res, 200, { data: data });
    } else {
      return error(res, 400, { message: messages.requirementNotFound });
    }
  } catch (err) {
    return error(res, 500);
  }
};

requirement.updateRequirement = async (req, res) => {
  try {
    const data = req.body;
    const requirementId = data?.requirementId;
    const userId = req.userId;
    const ibpId = req.ibpId;
    const userType = req.userType;
    const isStaff = userType === "staff";

    delete data.cp_id;
    delete data?.requirementId;

    const conditions = { id: requirementId, isDeleted: 0 };

    const requirementData = await PropertyRequirement.findOne({
      where: isStaff
        ? conditions
        : {
            ...conditions,
            [Op.or]: [{ userId: userId }, { ibpId: ibpId }],
          },
    });

    if (!requirementData) {
      return error(res, 400, { message: messages.requirementNotFound });
    }

    const val = {};
    for (const [key, value] of Object.entries(data)) {
      val[key] = Array.isArray(value) ? value.join(", ") : value;
    }

    if (isStaff) {
      val["updated_by"] = req.userId;
    }

    await PropertyRequirement.update(val, { where: { id: requirementId } });

    return success(res, 200, {
      message: messages.detailsSaved,
    });
  } catch (err) {
    return error(res, 500);
  }
};

requirement.getCommunityRequirement = async (req, res) => {
  try {
    const userType = req.userType;
    const isStaff = userType === "staff";
    const {
      for: forr,
      city,
      locality,
      type,
      propertyType,
      furnishing,
      budget,
      bedRoom,
      lookingFor,
      sort,
      user,
      staff,
      page,
    } = req.body;

    const ibpId = req?.ibpId || 0;

    const keys = [];
    const values = [];

    if (
      (Array.isArray(locality) && locality[0]) ||
      (!Array.isArray(locality) && locality)
    ) {
      const locRes = await Locality.findAll({
        where: {
          id: locality,
        },
        attributes: ["locality"],
      });
      const lty = locRes.map((ele) => ele.locality);

      if (lty.length > 0) {
        keys.push(
          "(p.locality in (?) OR p.nearByLocation1 in (?) OR p.nearByLocation2 in (?) OR p.nearByLocation3 in (?) OR p.nearByLocation4 in (?))"
        );
        values.push(lty, lty, lty, lty, lty);
      }
    }

    if (city && city != "all") {
      const cityRes = await City.findAll({
        where: {
          [Op.or]: [{ id: city }, { city: city }],
        },
        attributes: ["city"],
      });

      if (cityRes.length > 0) {
        keys.push("p.city = ?");
        values.push(cityRes[0]?.city);
      }
    }

    if (user && user != "all") {
      keys.push("p.userId = ?");
      values.push(user);
    }

    if (staff && staff != "all") {
      keys.push("p.created_by = ?");
      values.push(staff);
    }

    if (forr) {
      if (forr === "sale" || forr === "buy") {
        keys.push("p.property_for = ?");
        values.push("Buy");
      } else if (forr === "rent") {
        keys.push("p.property_for = ?");
        values.push("Rent/Lease");
      }
    }

    if (Array.isArray(propertyType) && propertyType[0]) {
      keys.push("p.property_type in (?)");
      values.push(propertyType.map((ele) => keyValues.propertyType[ele]));
    } else if (type) {
      if (type === "residential") {
        keys.push("p.property_type in (?)");
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
        keys.push("p.property_type in (?)");
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
        keys.push("p.property_type in (?)");
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
          keys.push("p.bedrooms > 7");
        } else {
          keys.push("p.bedrooms in (?) OR p.bedrooms > 7");
          values.push(bed);
        }
      } else {
        keys.push("p.bedrooms in (?)");
        values.push(bedRoom);
      }
    }

    if (Array.isArray(lookingFor) && lookingFor[0]) {
      keys.push("p.lookingFor in (?)");
      values.push(lookingFor.map((ele) => keyValues.lookingFor[ele]));
    }
    if (Array.isArray(furnishing) && furnishing[0]) {
      keys.push("p.furnish_status in (?)");
      values.push(furnishing.map((ele) => keyValues.furnishing[ele]));
    }

    if (budget && (budget?.min || budget?.max)) {
      if (budget?.min && budget?.max) {
        keys.push(
          "((p.budget_min >= ? AND p.budget_min <= ?) OR (p.budget_max >= ? AND p.budget_max <= ?) OR (p.budget_min >= ? AND p.budget_max <= ?))"
        );
        values.push(
          budget.min,
          budget.max,
          budget.min,
          budget.max,
          budget.min,
          budget.max
        );
      } else if (budget?.min) {
        keys.push("p.budget_max >= ?");
        values.push(budget.min);
      } else {
        keys.push("p.budget_min <= ?");
        values.push(budget.max);
      }
    }

    keys.push("p.postFor IN ('Community', 'CP')");

    if (!isStaff) {
      keys.push("p.isActive = 1");
      keys.push("p.isVerified = 1");
    }
    keys.push("p.isDeleted = 0");

    const sortValue = {
      rlv: "p.id ASC",
      nf: "p.id DESC",
      lth: "p.budget_min ASC",
      htl: "p.budget_min DESC",
    };

    let mainQry = keys.length > 0 ? `WHERE ${keys.join(" AND ")}` : "";

    const data = {};
    data.data = await sequelize.query(
      `SELECT p.*, u.name, u.email, u.user_name as mobile FROM post_requirement_hm1 p 
      LEFT JOIN user u ON p.ibpId = u.ibpid AND u.sub_role IS NULL 
      ${mainQry} GROUP BY p.id ORDER BY ${
        sortValue[sort] || sortValue.nf
      } LIMIT 20 OFFSET ${(page || 0) * 20}`,
      {
        replacements: values,
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!page || page == 0) {
      const res = await sequelize.query(
        `SELECT count(p.id) as total FROM post_requirement_hm1 p ${mainQry}`,
        {
          replacements: values,
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      data.total = res[0].total;
    }

    return success(res, 200, data);
  } catch (err) {
    return error(res, 500);
  }
};

requirement.getPropertyRequirement = async (req, res) => {
  const propertyId = req.params.id;
  const userId = req.userId;
  const ibpId = req.ibpId;

  try {
    const propertyData = await sequelize.query(
      `SELECT city, locality, forr, property_type, bedroom, car_parking, furnish_status,
      prop_availability, avai_from_year, floor_no, balconies, exp_price, monthly_rent 
      FROM post_sale_property_hm WHERE (user_id = ? OR ibpId = ?) AND id = ? AND isDeleted = 0 AND isActive = 1 AND status = 'Y'`,
      {
        replacements: [userId, ibpId, propertyId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!propertyData[0]) {
      return error(res, 400, { message: messages.propertyNotFound });
    }

    const {
      city,
      locality,
      property_type,
      forr,
      bedroom,
      car_parking,
      furnish_status,
      prop_availability,
      avai_from_year,
      floor_no,
      balconies,
      exp_price,
      monthly_rent,
    } = propertyData[0];

    let qry = ""; // "p.status = ?"
    const values = []; // ["Y"]

    // if (city) {
    //   qry += "p.city = ?";
    //   values.push(city);
    // }
    if (locality) {
      qry +=
        "(p.locality = ? OR p.nearByLocation1 = ? OR p.nearByLocation2 = ? OR p.nearByLocation3 = ? OR p.nearByLocation4 = ?)";
      values.push(locality, locality, locality, locality, locality);
    }

    if (property_type) {
      qry += " AND p.property_type = ?";
      values.push(property_type);
    }

    if (forr) {
      if (forr === "Sale") {
        qry += " AND p.property_for = ?";
        values.push("Buy");
      } else if (forr === "Rent/Lease") {
        qry += " AND p.property_for = ?";
        values.push("Rent/Lease");
      }
    }

    // if (bedroom) {
    //   qry += " AND p.bedrooms in (?)";
    //   values.push(bedroom);
    // }

    // if (furnish_status) {
    //   qry += " AND p.furnish_status in (?)";
    //   values.push(furnish_status);
    // }

    const price = forr === "Rent/Lease" ? monthly_rent : exp_price;

    if (price) {
      qry += " AND p.budget_min <= ?";
      values.push(price);
      qry += " AND p.budget_max >= ?";
      values.push(price);
    }

    // if (lookingFor) {
    //   if (lookingFor === "Ready Possession") {
    //     qry += " AND p.prop_availability = ?";
    //     values.push("Ready to Move");
    //   } else {
    //     const no = lookingFor.match(/(\d+)/)[0];
    //     const year = moment().year() + parseInt(no);
    //     qry += " AND p.avai_from_year <= ?";
    //     values.push(year);
    //   }
    // }

    // if (floor) {
    //   if (floor === "Above 15") {
    //     qry += " AND p.floor_no > ?";
    //     values.push(15);
    //   } else {
    //     const tmp = floor.match(/(\d+)\s*-\s*(\d+)/);
    //     const min = parseInt(tmp[1]);
    //     const max = parseInt(tmp[2]);
    //     qry += " AND p.floor_no >= ? AND p.floor_no <= ?";
    //     values.push(min, max);
    //   }
    // }

    // if (balcony) {
    //   if (balcony === "Not Required") {
    //     qry += " AND p.balconies = ?";
    //     values.push(0);
    //   } else if (balcony === "Yes") {
    //     qry += " AND p.balconies > ?";
    //     values.push(0);
    //   } else if (balcony === "Maybe") {
    //     // do nothing
    //   }
    // }

    /* qry += " AND p.userId != ?";
      values.push(userId); */

    qry += " AND p.postFor IN ('Community', 'CP')";

    qry += " AND p.isDeleted = 0 AND p.isActive = 1 AND p.isVerified = 1";

    const data = await sequelize.query(
      `SELECT p.*, u.name, u.email, u.user_name as mobile FROM post_requirement_hm1 p 
        LEFT JOIN user u ON p.ibpId = u.ibpid AND u.sub_role IS NULL 
        WHERE ${qry} GROUP BY p.id ORDER BY p.id DESC`,
      {
        replacements: values,
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    success(res, 200, { data });
  } catch (err) {
    error(res, 500);
  }
};

requirement.updateActive = async (req, res) => {
  const { userId, ibpId, userType } = req;
  const { requirementId } = req.params;
  const { isActive } = req.body;

  try {
    const isExist = await checkRequirementExist(
      requirementId,
      userId,
      ibpId,
      userType
    );
    if (!isExist) {
      return error(res, 400, { message: messages.requirementNotFound });
    }

    const active =
      isActive == 1 || isActive == "true" || isActive == true ? 1 : 0;

    await PropertyRequirement.update(
      { isActive: active },
      {
        where: {
          id: requirementId,
        },
      }
    );

    return success(res, 200, {
      message: `Requirement has been successfully ${
        active ? "Activated" : "Deactivated"
      }.`,
    });
  } catch (err) {
    return error(res, 500);
  }
};

requirement.deleteRequirement = async (req, res) => {
  const { requirementId } = req.params;
  const { userId, ibpId, userType } = req;

  try {
    const isExist = await checkRequirementExist(
      requirementId,
      userId,
      ibpId,
      userType
    );
    if (!isExist) {
      return error(res, 400, { message: messages.requirementNotFound });
    }
    /* await sequelize.query(
        `DELETE FROM post_requirement_hm1 WHERE ${conditions}`,
        {
          replacements:
            userType === "staff"
              ? [requirementId]
              : [requirementId, userId, ibpId],
          type: Sequelize.QueryTypes.DELETE,
        }
      ); */

    await PropertyRequirement.update(
      { isDeleted: 1, deletedAt: new Date() },
      {
        where: {
          id: requirementId,
        },
      }
    );

    return success(res, 200, {
      message: messages.deleteSuccess,
    });
  } catch (err) {
    return error(res, 500);
  }
};

module.exports = requirement;
