const RecentSearch = require("./../models/RecentSearch");
const Shortlisted = require("./../models/Shortlisted");
const Viewed = require("./../models/Viewed");
const { success, error } = require("./../../../utils/response");
const mail = require("./../../../services/mail");
const { sequelize } = require("../../database");
const { Sequelize } = require("sequelize");
const City = require("../models/City");
const Locality = require("../models/Locality");
const moment = require("moment/moment");
const { propertyCardFields } = require("../../../utils/data");

const activity = {};

activity.viewed = async (req, res) => {
  try {
    let data = [];
    if (req?.userId) {
      data = await sequelize.query(
        `SELECT p.id, ${propertyCardFields}, vw.updatedAt as date, pi.file as img,
        CASE WHEN sh.propertyId IS NOT NULL THEN 1 ELSE 0 END AS isShortlisted
        FROM vieweds_hm vw
        JOIN post_sale_property_hm p ON vw.propertyId = p.id 
        LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
        LEFT JOIN shortlisteds_hm sh ON p.id = sh.propertyId AND sh.userId = vw.userId
        WHERE vw.userId = ? GROUP BY vw.id ORDER BY vw.updatedAt DESC`,
        {
          replacements: [req.userId],
          type: Sequelize.QueryTypes.SELECT,
        }
      );
    } else {
      const d = req.body?.data || "";
      const list = d.split(",");
      data = list;
    }

    return success(res, 200, {
      data,
    });
  } catch (err) {
    return error(res, 500);
  }
};

activity.addViewed = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const d = await Viewed.findOne({
        where: { userId: data.userId, propertyId: data.propertyId },
        attributes: ["id"],
      });
      if (d) {
        await Viewed.update(
          { userId: data.userId },
          {
            where: { id: d.id },
          }
        );
      } else {
        await Viewed.create(data);
      }
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

activity.contacted = async (req, res) => {
  try {
    let data = await sequelize.query(
      `SELECT ct.*, p.id as id, ${propertyCardFields}, pi.file as img,
      CASE WHEN sh.propertyId IS NOT NULL THEN 1 ELSE 0 END AS isShortlisted
      FROM contacteds_hm ct
      JOIN post_sale_property_hm p ON ct.propertyId = p.id 
      LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
      LEFT JOIN shortlisteds_hm sh ON p.id = sh.propertyId AND sh.userId = ?
      WHERE ct.userId = ? GROUP BY ct.id ORDER BY ct.createdAt DESC`,
      {
        replacements: [req.userId, req.userId],
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

activity.addHistory = async (req, res) => {
  const { city, locality, type, url } = req.body;

  if (!type) {
    return error(res, 400);
  }

  let title = type;

  const cityRes = await City.findOne({
    where: {
      id: city || 0,
    },
    attributes: ["city"],
  });

  const localityRes = await Locality.findOne({
    where: {
      id: locality || 0,
    },
    attributes: ["locality"],
  });

  if (locality && localityRes) {
    title += ` - ${localityRes?.locality}, ${cityRes?.city}`;
  } else {
    title += ` - ${cityRes ? cityRes?.city : "anywhere"}`;
  }

  const data = {
    userId: req.userId,
    title: title,
    url: url,
  };

  try {
    const d = await RecentSearch.findOne({
      where: { userId: data.userId },
      attributes: ["id", "url", "updatedAt"],
      order: [["updatedAt", "DESC"]],
    });
    if (
      d &&
      d.url === data.url &&
      moment(d.updatedAt).format("LL") === moment().format("LL")
    ) {
      await RecentSearch.update(
        { userId: data.userId },
        {
          where: { id: d.id },
        }
      );
    } else {
      await RecentSearch.create(data);
    }
    return success(res, 200);
  } catch (err) {
    return error(res, 500);
  }
};

activity.getHistory = async (req, res) => {
  try {
    const data = await RecentSearch.findAll({
      where: { userId: req.userId },
      order: [["updatedAt", "DESC"]],
    });

    return success(res, 200, {
      data,
    });
  } catch (err) {
    return error(res, 500);
  }
};

activity.getSiteVisits = async (req, res) => {
  try {
    let data = await sequelize.query(
      `SELECT sv.*, p.id as id, ${propertyCardFields}, pi.file as img
      FROM site_visit_form_hm sv
      JOIN post_sale_property_hm p ON sv.propertyId = p.id 
      LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
      WHERE sv.userId = ? GROUP BY sv.id ORDER BY sv.createdAt DESC`,
      {
        replacements: [req.userId],
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

activity.shortlisted = async (req, res) => {
  try {
    let data = [];
    if (req?.userId) {
      data = await Shortlisted.findAll({
        where: { userId: req.userId },
        attributes: ["propertyId", "createdAt"],
      });

      data = await sequelize.query(
        `SELECT p.id, ${propertyCardFields}, sh.createdAt as date, pi.file as img,
        CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END AS isShortlisted
        FROM shortlisteds_hm sh
        JOIN post_sale_property_hm p ON sh.propertyId = p.id 
        LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
        WHERE sh.userId = ? GROUP BY sh.id ORDER BY sh.id DESC`,
        {
          replacements: [req.userId],
          type: Sequelize.QueryTypes.SELECT,
        }
      );
    } else {
      const d = req.body?.data || "";
      const list = d.split(",");
      data = list;
    }

    return success(res, 200, {
      data,
    });
  } catch (err) {
    return error(res, 500);
  }
};

activity.addShortlist = async (req, res) => {
  try {
    const exists = await Shortlisted.findOne({
      where: {
        userId: req.userId,
        propertyId: req.body.propertyId,
      },
    });
    if (!exists)
      await Shortlisted.create({
        userId: req.userId,
        propertyId: req.body.propertyId,
      });
    return success(res, 200);
  } catch (err) {
    return error(res, 500);
  }
};

activity.removeShortlist = async (req, res) => {
  try {
    await Shortlisted.destroy({
      where: { userId: req.userId, propertyId: req.body.propertyId },
    });
    return success(res, 200);
  } catch (err) {
    return error(res, 500);
  }
};

module.exports = activity;
