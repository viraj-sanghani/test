const { Sequelize, Op } = require("sequelize");
const path = require("path");
const sharp = require("sharp");
const config = require("../../config");
const { sequelize } = require("./../../database");
const { addressToCoordinates } = require("./maps");
const activity = require("./activity");
const siteVisit = require("../models/SiteVisit");
const City = require("../models/City");
const Locality = require("../models/Locality");
const PropertyImage = require("../models/PropertyImage");
const Contacted = require("../models/Contacted");
const PropertyRequirement = require("../models/PropertyRequirement");
const mail = require("../../../services/mail");
const s3 = require("../../../services/aws-s3");
const { success, error } = require("./../../../utils/response");
const {
  keyMap,
  propertyCardFields,
  step1FormFields,
  propertyFormData,
} = require("../../../utils/data");
const {
  hideMobileNumber,
  hideEmailAddress,
  convertValidStr,
  formatNumber,
} = require("../../../utils/common");
const messages = require("../../../utils/messages");
const { resizeImage } = require("../../../utils/resize");
const { createMetaData } = require("../../../utils/metaData");
const PropertyShared = require("../models/PropertyShared");
const { default: axios } = require("axios");
const { generateEncryptedToken } = require("../../../utils/crypto");

const property = {};

const getMailPropertyData = (id) => {
  return new Promise(async (resolve) => {
    let data = null;
    try {
      const result = await sequelize.query(
        `SELECT r.name, r.email, p.id, p.project_name, p.postFor, p.property_type, p.address, p.locality, p.city, p.bedroom, p.exp_price, p.monthly_rent, (SELECT file FROM property_images_hm pi WHERE pi.propertyId = p.id AND pi.label = "Main Image" LIMIT 1) as img
        FROM post_sale_property_hm p
        LEFT JOIN user r ON p.ibpId = r.ibpid AND r.sub_role IS NULL 
        WHERE p.id = ?`,
        {
          replacements: [id],
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      if (result[0]) {
        data = {
          name: result[0]?.name,
          email: result[0]?.email,
          url: `${config.CLIENT_URL}/property/${(result[0].project_name || "")
            .toLowerCase()
            .replaceAll(" ", "-")}-${id}`,
          img: `${config.AWS_URL}/property/small/${
            result[0]?.img || "no-image.png"
          }`,
          title: `₹ ${formatNumber(
            result[0]?.exp_price || result[0]?.monthly_rent || 0
          )} ${result[0]?.monthly_rent ? "<small>/ month</small>" : ""}`,
          desc: `${result[0]?.project_name ? result[0]?.project_name : ""} ${
            result[0]?.postFor === "CP" ? "(Only CP Group)" : ""
          } ${result[0]?.bedroom ? ", " + result[0]?.bedroom + " BHK" : ""} ${
            result[0]?.property_type
          }, ${result[0]?.locality}, ${result[0]?.city}`,
          type: result[0].property_type,
          location: result[0].address,
        };
      }
    } catch (err) {}
    resolve(data);
  });
};

const updateMetaData = async (id) => {
  try {
    let data = await sequelize.query(
      `SELECT * FROM post_sale_property_hm WHERE id = ?`,
      {
        replacements: [id],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (data && data[0]) {
      const { title, desc, url } = await createMetaData(data[0]);
      sequelize.query(
        `UPDATE post_sale_property_hm SET
        meta_title = ?, meta_description = ?,url = ? 
        WHERE id = ?`,
        {
          replacements: [title, desc, url, id],
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
    }
  } catch (err) {}
};

const sendPropertyToHm = async (id) => {
  try {
    let data = await sequelize.query(
      `SELECT p.*, r.name as name1, r.email as email1, r.user_name as mobile1 FROM post_sale_property_hm as p 
      LEFT JOIN user r ON p.ibpId = r.ibpid AND r.sub_role IS NULL 
      WHERE p.id = ?`,
      {
        replacements: [id],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (data[0] && data[0].postFor === "B2C") {
      const property = data[0];

      let images = await sequelize.query(
        `SELECT file as img, label as type
        FROM property_images_hm WHERE propertyId = ?`,
        {
          replacements: [id],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (images) {
        property.images = images;
      }

      property.token = generateEncryptedToken({
        propertyId: property.id,
        name: property.name1,
        email: property.email1,
        mobile: property.mobile1,
      });

      delete property.name1;
      delete property.email1;
      delete property.mobile1;

      await axios.post(`${config.HM_SERVER_URL}/npb/upload-property`, property);
    }
  } catch (err) {}
};

const deletePropertyFromHm = async (id) => {
  try {
    let data = await sequelize.query(
      `SELECT p.postFor, u.user_name as mobile FROM post_sale_property_hm as p 
      LEFT JOIN user u ON p.ibpId = u.ibpid AND u.sub_role IS NULL 
      WHERE p.id = ?`,
      {
        replacements: [id],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (data[0] && data[0].postFor === "B2C") {
      const token = generateEncryptedToken({
        propertyId: id,
        mobile: data[0].mobile,
      });

      await axios.post(`${config.HM_SERVER_URL}/npb/delete-property`, {
        token,
      });
    }
  } catch (err) {}
};

const checkPropertyExist = async (propertyId, userId, ibpId, userType) => {
  try {
    let conditions = "";

    if (userType === "staff") {
      conditions = "id = ?";
    } else {
      conditions = "id = ? AND (user_id = ? OR ibpId = ?)";
    }

    const result = await sequelize.query(
      `SELECT id FROM post_sale_property_hm WHERE ${conditions} AND isDeleted = 0`,
      {
        replacements:
          userType === "staff" ? [propertyId] : [propertyId, userId, ibpId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (result[0]) {
      return true;
    }
  } catch (err) {}
  return false;
};

property.getPropertyTypes = (req, res) => {
  try {
    const data = [];

    for (const [key, value] of Object.entries(step1FormFields)) {
      if (
        ![
          "Flat/Apartment",
          "Residential House",
          "Commercial Office Space",
          "Commercial Shop",
        ].includes(key)
      ) {
        continue;
      }

      const obj = {
        type: key,
        for: [],
      };
      for (const forKey of Object.keys(value)) {
        obj.for.push(forKey);
      }

      data.push(obj);
    }

    return success(res, 200, { data: data });
  } catch (err) {
    console.log(err);
    return error(res, 500);
  }
};

property.getPropertyFields = (req, res) => {
  try {
    const { propertyType, propertyFor } = req.body;
    if (!propertyType)
      return error(res, 400, { message: "Property type is required" });
    if (!propertyFor)
      return error(res, 400, { message: "Property for is required" });
    const data = step1FormFields[propertyType]
      ? step1FormFields[propertyType][propertyFor] || []
      : [];
    return success(res, 200, { data: data });
  } catch (err) {
    return error(res, 500);
  }
};

property.getPropertyFormData = (req, res) => {
  try {
    return success(res, 200, { data: propertyFormData });
  } catch (err) {
    return error(res, 500);
  }
};

property.getCity = async (req, res) => {
  try {
    const data = await City.findAll({
      where: { status: "Y" },
      order: [["city", "ASC"]],
      attributes: ["id", "city"],
    });
    return success(res, 200, { data });
  } catch (err) {
    return error(res, 500);
  }
};

property.getLocality = async (req, res) => {
  const cityName = req.body.city;

  const match = { status: "Y" };

  if (cityName) {
    match.city_name = cityName;
  }

  try {
    const data = await Locality.findAll({
      where: match,
      order: [["locality", "ASC"]],
      attributes: ["id", "locality", "city_name"],
    });
    return success(res, 200, { data });
  } catch (err) {
    return error(res, 500);
  }
};

property.getUsers = async (req, res) => {
  try {
    if (req.userType === "staff" || req.userType === "Admin") {
      const data = await sequelize.query(
        `SELECT u.id, i.iname, i.ihand, i.owner, i.iemail, i.whatsapp FROM ibp i 
        JOIN user u ON i.id = u.ibpid 
        GROUP BY u.id`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      const obj = {};
      let label = "";

      const users = data.map((ele) => {
        label = `${ele.iname} / ${ele.ihand} / ${ele.owner}`;
        if (obj[label]) {
          obj[label] = obj[label] === true ? 1 : obj[label] + 1;
          return {
            label: `${label} ${obj[label]}`,
            value: ele.id,
            data: {
              name: ele.owner,
              email: ele.iemail,
              mobile: ele.ihand,
              whatsapp: ele.whatsapp,
            },
          };
        }
        obj[label] = true;
        return {
          label: label,
          value: ele.id,
          data: {
            name: ele.owner,
            email: ele.iemail,
            mobile: ele.ihand,
            whatsapp: ele.whatsapp,
          },
        };
      });

      return success(res, 200, { data: users });
    } else {
      return error(res, 403);
    }
  } catch (err) {
    console.log(err);
    return error(res, 500);
  }
};

property.getStaffUsers = async (req, res) => {
  try {
    if (req.userType === "Admin") {
      const data = await sequelize.query(
        `SELECT id, user_name as mobile, name FROM user WHERE role_type = 'staff'`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      const obj = {};
      let label = "";

      const users = data.map((ele) => {
        label = `${ele.mobile} / ${ele.name}`;
        if (obj[label]) {
          obj[label] = obj[label] === true ? 1 : obj[label] + 1;
          return {
            label: `${label} ${obj[label]}`,
            value: ele.id,
            data: {
              name: ele.name,
              mobile: ele.mobile,
            },
          };
        }
        obj[label] = true;
        return {
          label: label,
          value: ele.id,
          data: {
            name: ele.name,
            mobile: ele.mobile,
          },
        };
      });

      return success(res, 200, { data: users });
    } else {
      return error(res, 403);
    }
  } catch (err) {
    console.log(err);
    return error(res, 500);
  }
};

property.myListings = async (req, res) => {
  const userId = req.userId;
  const ibpId = req.ibpId;
  try {
    const data = await sequelize.query(
      `SELECT p.id as id, p.date, p.forr, p.status, p.isActive, p.name, p.email, p.mobile, p.whatsapp, p.address, ${propertyCardFields}, 
      count(ct.id) as contacted, count(sv.id) as siteVisits, count(st.id) as shortlisted, 
      (SELECT file FROM property_images_hm pi WHERE pi.propertyId = p.id AND pi.label = "Main Image" LIMIT 1)  as img
      FROM post_sale_property_hm p
      LEFT JOIN contacteds_hm ct ON p.id = ct.propertyId 
      LEFT JOIN site_visit_form_hm sv ON p.id = sv.propertyId 
      LEFT JOIN shortlisteds_hm st ON p.id = st.propertyId 
      WHERE (p.user_id = ? OR p.ibpId = ?) AND p.isComplete = 1 AND p.isDeleted = 0 GROUP BY p.id ORDER BY p.id DESC`,
      {
        replacements: [userId, ibpId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return success(res, 200, { data });
  } catch (err) {
    return error(res, 500);
  }
};

property.leads = async (req, res) => {
  try {
    let listings = await sequelize.query(
      `SELECT GROUP_CONCAT(id SEPARATOR ',') AS arr FROM post_sale_property_hm
        WHERE user_id = ?`,
      {
        replacements: [req.userId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const arr = listings[0].arr || "";

    let data = await sequelize.query(
      `SELECT ct.*, p.id as id, ${propertyCardFields}, pi.file as img
        FROM contacteds_hm ct
        JOIN post_sale_property_hm p ON ct.propertyId = p.id 
        LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
        WHERE ct.propertyId in (${arr}) GROUP BY ct.id ORDER BY ct.createdAt DESC`,
      {
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

property.siteVisits = async (req, res) => {
  try {
    let listings = await sequelize.query(
      `SELECT GROUP_CONCAT(id SEPARATOR ',') AS arr FROM post_sale_property_hm
        WHERE user_id = ?`,
      {
        replacements: [req.userId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const arr = listings[0].arr || "";

    let data = await sequelize.query(
      `SELECT sv.*, p.id as id, ${propertyCardFields}, pi.file as img
        FROM site_visit_form_hm sv
        JOIN post_sale_property_hm p ON sv.propertyId = p.id 
        LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
        WHERE sv.propertyId in (${arr}) GROUP BY sv.id ORDER BY sv.createdAt DESC`,
      {
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

property.draftProperty = async (req, res) => {
  const userId = req.userId;
  const userType = req?.userType || "";
  // const CP_ID = userType === "staff" ? data?.cp_id || "" : "";

  try {
    const data = await sequelize.query(
      `SELECT p.*, p.id as id
      FROM post_sale_property_hm p
      WHERE (user_id = ? OR created_by = ?) AND isComplete = 0 GROUP BY p.id`,
      {
        replacements: [userId, userId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (data.length > 0)
      return success(res, 200, { data: data[0], hasDrafted: true });
    else return success(res, 200, { data: {}, hasDrafted: false });
  } catch (err) {
    return error(res, 500);
  }
};

property.saveProperty = async (req, res) => {
  const data = req.body;
  const userId = req.userId;
  const ibpId = req.ibpId;
  const userType = req?.userType || "";
  const CP_ID = userType === "staff" ? data?.cp_id || "" : "";

  delete data.cp_id;

  try {
    let propertyId;

    const d = await sequelize.query(
      `SELECT id FROM post_sale_property_hm
      WHERE (user_id = ? OR created_by = ?) AND isComplete = 0`,
      {
        replacements: [userId, userId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (d.length > 0) {
      propertyId = d[0].id;
      let values = [];

      for (const [key, val] of Object.entries(data)) {
        values.push(`${keyMap[key]} = '${convertValidStr(val)}'`);
      }

      if (CP_ID) {
        values.push(`user_id = ${CP_ID}`);
      }

      const qry = await sequelize.query(
        `UPDATE post_sale_property_hm SET
        ${values.join(",")}
        WHERE id = ?`,
        {
          replacements: [propertyId],
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
    } else {
      let columns = ["user_id", "ibpId"];
      let values = [];

      if (CP_ID) {
        values.push(CP_ID, ibpId);
        columns.push("created_by");
        values.push(userId);
      } else {
        values.push(userId, ibpId);
      }

      if (!data?.latitude || !data?.longitude) {
        const coords = await addressToCoordinates([
          `${data?.project_name}, ${data?.address}, ${data?.locality}, ${data?.city}`,
        ]);
        if (coords[0]) {
          data.latitude = coords[0].latitude;
          data.longitude = coords[0].longitude;
        }
      }

      for (const [key, val] of Object.entries(data)) {
        columns.push(keyMap[key]);
        values.push(`'${convertValidStr(val)}'`);
      }

      const qry = await sequelize.query(
        `INSERT INTO post_sale_property_hm (${columns.join(
          ","
        )}) VALUES (${values.join(",")})`,
        {
          type: Sequelize.QueryTypes.CREATE,
        }
      );
      propertyId = qry[0];
    }
    updateMetaData(propertyId);
    return success(res, 200, {
      propertyId,
      message: messages.detailsSaved,
    });
  } catch (err) {
    return error(res, 500);
  }
};

property.editPropertyInfo = async (req, res) => {
  const { propertyId } = req.params;
  const userId = req.userId;
  const ibpId = req.ibpId;
  const userType = req?.userType || "";
  const isStaff = userType === "staff";

  const conditions = !isStaff ? "AND (user_id = ? OR ibpId = ?)" : "";

  try {
    let data = await sequelize.query(
      `SELECT * FROM post_sale_property_hm WHERE id = ? AND isDeleted = 0 ${conditions}`,
      {
        replacements: isStaff ? [propertyId] : [propertyId, userId, ibpId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (data[0]) {
      let images = await sequelize.query(
        `SELECT id, file as img, label as type
        FROM property_images_hm WHERE propertyId = ?`,
        {
          replacements: [propertyId],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (images) {
        data[0].images = images;
      }

      return success(res, 200, { data: data[0] });
    } else {
      return error(res, 400, { message: messages.propertyNotFound });
    }
  } catch (err) {
    return error(res, 500);
  }
};

property.updateProperty = async (req, res) => {
  const data = req.body;
  const userId = req.userId;
  const ibpId = req.ibpId;
  const propertyId = req.params?.propertyId;
  const userType = req?.userType || "";
  const CP_ID = userType === "staff" ? data?.cp_id || "" : "";
  delete data.cp_id;

  if (!propertyId) {
    return error(res, 400, { message: messages.propertyNotFound });
  }

  try {
    let values = [];

    for (const [key, val] of Object.entries(data)) {
      values.push(`${keyMap[key]} = '${convertValidStr(val)}'`);
    }

    if (CP_ID) {
      values.push(`updated_by = ${userId}`);
    }

    const qry = await sequelize.query(
      `UPDATE post_sale_property_hm SET
        ${values.join(",")}
        WHERE id = ? ${!CP_ID ? "AND (user_id = ? OR ibpId = ?)" : ""}`,
      {
        replacements: CP_ID ? [propertyId] : [propertyId, userId, ibpId],
        type: Sequelize.QueryTypes.UPDATE,
      }
    );

    updateMetaData(propertyId);

    return success(res, 200, {
      propertyId,
    });
  } catch (err) {
    console.log(err);
    return error(res, 500);
  }
};

property.uploadImages = async (req, res) => {
  try {
    const { propId, isComplete, deleteVideo } = req.body;
    const isVideoDelete = [true, "true", 1, "1"].includes(deleteVideo)
      ? true
      : false;
    const { userType, userId, ibpId } = req;

    const curProperty = await sequelize.query(
      `SELECT postFor, video FROM post_sale_property_hm WHERE id = ? AND (user_id = ? OR ibpId = ?) AND isDeleted = 0`,
      {
        replacements: [propId, userId, ibpId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!curProperty[0]) {
      return error(res, 400, { message: messages.propertyNotFound });
    }

    // Handle deleted

    const deleteFiles = req.body?.deleteFiles
      ? Array.isArray(req.body?.deleteFiles)
        ? req.body?.deleteFiles
        : [...req.body?.deleteFiles.split(",")]
      : [];

    if (deleteFiles.length > 0) {
      const img = await sequelize.query(
        `SELECT file FROM property_images_hm WHERE id in (${deleteFiles})`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      const org = img.map((ele) => `cp/property/original/${ele.file}`);
      const sml = img.map((ele) => `cp/property/small/${ele.file}`);

      s3.deleteFilesFromBucket([...org, ...sml]);
    }

    deleteFiles.forEach((ele) => {
      PropertyImage.destroy({
        where: { id: ele },
      });
    });

    // Resize and watermark

    const watermarkImgB2C = await sharp(
      path.join("static/watermark.png")
    ).toBuffer();
    const watermarkImgNPB = await sharp(
      path.join("static/watermark1.png")
    ).toBuffer();
    const isB2C = curProperty[0].postFor === "B2C";

    const data = [];
    const original = [];
    const small = [];
    let video = null;

    for (const [key, imagesArray] of Object.entries(req.files)) {
      console.log(key, imagesArray);
      if (key === "Videos") {
        const file = imagesArray[0];
        if (file && file.mimetype === "video/mp4") {
          const fileName = `${propId}${Math.floor(
            Math.random() * 100000
          )}${Date.now().toString()}.mp4`;
          video = {
            fileName: fileName,
            file: file.buffer,
          };
        }
      } else {
        for (const image of imagesArray) {
          const fileName = `${propId}${Math.floor(
            Math.random() * 100000
          )}${Date.now().toString()}.jpg`;

          const resizedImg = await resizeImage(image.buffer, [1024, 768], 100);
          const originalImg = await sharp(resizedImg)
            .composite([
              {
                input: isB2C ? watermarkImgB2C : watermarkImgNPB,
                gravity: "center",
              },
            ])
            .toBuffer();
          const smallImg = await resizeImage(originalImg, [400, 300], 70);

          original.push({ fileName: fileName, file: originalImg });
          small.push({ fileName: fileName, file: smallImg });
          data.push({
            propertyId: propId,
            file: fileName,
            label: key,
          });
        }
      }
    }

    // Store in db

    const imgData = await PropertyImage.bulkCreate(data);

    const imgs = {};

    imgData.forEach((ele) => {
      if (!imgs[ele.label]) {
        imgs[ele.label] = [];
      }
      imgs[ele.label].push({ id: ele.id, file: ele.file });
    });

    const finalData = [];

    Object.entries(imgs).forEach((ele) => {
      finalData.push({
        key: ele[0],
        images: ele[1],
      });
    });

    if (isComplete) {
      await sequelize.query(
        /* userType === "staff"
          ? `UPDATE post_sale_property_hm SET isComplete = 1, status = "Y" WHERE id = ?`
          : `UPDATE post_sale_property_hm SET isComplete = 1 WHERE id = ?`, */
        `UPDATE post_sale_property_hm SET isComplete = 1 WHERE id = ?`,
        {
          replacements: [propId],
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
      sendPropertyToHm(propId);
    }

    if (video || isVideoDelete) {
      await sequelize.query(
        `UPDATE post_sale_property_hm SET video = ? WHERE id = ?`,
        {
          replacements: [video ? video.fileName : "", propId],
          type: Sequelize.QueryTypes.UPDATE,
        }
      );

      curProperty[0].video &&
        s3.deleteFilesFromBucket([`cp/property/video/${curProperty[0].video}`]);
    }

    // Upload to S3

    const promises = [];

    for (let i = 0; i < original.length; i++) {
      promises.push(s3.uploadPropOriginal(original[i]));
      promises.push(s3.uploadPropSmall(small[i]));
    }

    const result = await Promise.allSettled(promises);

    success(res, 200, {
      message: messages.detailsSaved,
      data: finalData,
    });

    video && s3.uploadPropVideo(video);
  } catch (err) {
    return error(res, 500);
  }
};

property.home = async (req, res) => {
  const userType = req?.userType;
  let qry = "";

  if (userType !== "Channel Partner") {
    qry += "AND p.postFor IN ('', 'B2C')";
  } else {
    qry += "AND p.postFor NOT IN ('Self')";
  }

  try {
    let sale = await sequelize.query(
      `SELECT p.id as id, p.date, ${propertyCardFields}, pi.file as img
      FROM post_sale_property_hm p
      LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
      WHERE p.forr = "Sale" ${qry} AND p.status = "Y" AND p.isActive = 1 AND p.isDeleted = 0 GROUP BY p.id ORDER BY p.id DESC LIMIT 15`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let rental = await sequelize.query(
      `SELECT p.id as id, p.date, ${propertyCardFields}, pi.file as img
      FROM post_sale_property_hm p
      LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
      WHERE p.forr = "Rent/Lease" ${qry} AND p.status = "Y" AND p.isActive = 1 AND p.isDeleted = 0 GROUP BY p.id ORDER BY p.id DESC LIMIT 15`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    return success(res, 200, { data: { sale: sale, rental: rental } });
  } catch (err) {
    return error(res, 500);
  }
};

property.addSharedProperty = async (req, res) => {
  const { propertyId, token } = req.body;
  try {
    await PropertyShared.create({
      propertyId,
      token,
    });
    return success(res, 200);
  } catch (err) {
    console.log(err);
    return error(res, 500);
  }
};

property.info = async (req, res) => {
  const { id, token } = req.params;
  const userId = req?.userId || 0;
  const ibpId = req?.ibpId || 0;
  const userType = req?.userType;
  let qry = "";

  try {
    let isShared = null;

    if (token) {
      isShared = await PropertyShared.findOne({
        where: {
          propertyId: id,
          token,
        },
      });
    }

    // if (userType !== "Channel Partner") {
    //   qry += "AND (p.postFor IN ('', 'B2C') OR p.user_id = ?)";
    // } else {
    !isShared &&
      userType !== "staff" &&
      (qry +=
        "AND (p.postFor NOT IN ('Self') OR p.user_id = ? OR p.ibpId = ?)");
    // }

    let data = await sequelize.query(
      `SELECT p.*, u.name, r.email, r.user_name as mobile FROM post_sale_property_hm as p 
      LEFT JOIN user r ON p.ibpId = r.ibpid AND r.sub_role IS NULL 
      LEFT JOIN user u ON p.user_id = u.id 
      WHERE p.id = ? ${qry} AND p.status = "Y" AND p.isActive = 1 AND p.isDeleted = 0`,
      {
        replacements: [id, userId, ibpId],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (data[0]) {
      let images = await sequelize.query(
        `SELECT file as img, label as type
        FROM property_images_hm WHERE propertyId = ?`,
        {
          replacements: [id],
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (images) {
        data[0].images = images;
      }

      // data[0].mobile = hideMobileNumber(data[0]?.mobile || "");
      // data[0].email = hideEmailAddress(data[0]?.email || "");

      if (req?.userId) {
        await activity.addViewed({ userId: req.userId, propertyId: id });
      }

      return success(res, 200, { data: data[0] });
    } else {
      return error(res, 400, { message: messages.propertyNotFound });
    }
  } catch (err) {
    return error(res, 500);
  }
};

property.compareInfo = async (req, res) => {
  const properties = req.body?.properties || [];

  if (properties.length === 0)
    return error(res, 400, { message: messages.propertyNotFound });

  try {
    let data = await sequelize.query(
      `SELECT p.*, pi.file as img 
      FROM post_sale_property_hm as p 
      LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
      WHERE p.id in (${properties.join(
        ","
      )}) AND p.status = "Y" AND p.isActive = 1 AND p.isDeleted = 0 GROUP BY p.id`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (data[0]) {
      for (let i = 0; i < data.length; i++) {
        data[i].mobile = hideMobileNumber(data[i]?.mobile || "");
        data[i].email = hideEmailAddress(data[i]?.email || "");
      }

      return success(res, 200, { data });
    } else {
      return error(res, 400, { message: messages.propertyNotFound });
    }
  } catch (err) {
    return error(res, 500);
  }
};

property.siteVisitAdd = async (req, res) => {
  const { prop_id, name, mobile, email, message, dateTime, alongWith } =
    req.body;
  try {
    await siteVisit.create({
      name,
      propertyId: prop_id,
      userId: req.userId,
      mobile,
      email,
      message,
      dateTime,
      alongWith,
    });

    const result = await getMailPropertyData(prop_id);

    if (result) {
      const owner = { name: result.name, email: result.email };
      const propertyDetail = {
        url: result.url,
        img: result.img,
        title: result.title,
        desc: result.desc,
        type: result.type,
        location: result.location,
      };

      await mail.siteVisit(
        email,
        owner,
        name,
        mobile,
        message,
        dateTime,
        alongWith,
        propertyDetail
      );
    }

    return success(res, 200, { message: messages.visitScheduleSuccess });
  } catch (err) {
    return error(res, 500);
  }
};

property.addContacted = async (req, res) => {
  const data = {
    userId: req.userId,
    propertyId: req.body.propertyId,
    reasonToBuy: req.body.reasonToBuy || null,
    isDealer: req.body.isDealer,
    planningToBuy: req.body.planningToBuy || null,
    homeLoan: req.body.homeLoan || null,
    siteVisit: req.body.siteVisit,
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
  };
  try {
    await Contacted.create(data);

    const result = await getMailPropertyData(req.body.propertyId);

    if (result) {
      const owner = { name: result.name, email: result.email };
      const propertyDetail = {
        url: result.url,
        img: result.img,
        title: result.title,
        desc: result.desc,
      };

      await mail.contacted(
        data.email,
        owner,
        data.name,
        data.mobile,
        data.reasonToBuy,
        data.isDealer,
        data.planningToBuy,
        data.homeLoan,
        data.siteVisit,
        propertyDetail
      );
    }

    return success(res, 200, {
      message: messages.contactedSuccess,
    });
  } catch (err) {
    return error(res, 500);
  }
};

property.getRequirementProperty = async (req, res) => {
  const requirementId = req.params.id;
  const userId = req.userId;
  const ibpId = req.ibpId;

  try {
    const requirementData = await PropertyRequirement.findOne({
      where: {
        [Op.or]: [{ userId: userId }, { ibpId: ibpId }],
        id: requirementId,
        isActive: 1,
        isVerified: 1,
        isDeleted: 0,
      },
    });

    if (!requirementData) {
      return error(res, 400, { message: messages.requirementNotFound });
    }

    const {
      city,
      locality,
      property_type,
      property_for,
      bedrooms,
      parking,
      furnish_status,
      lookingFor,
      floor,
      balcony,
      budget_min,
      budget_max,
      nearByLocation1,
      nearByLocation2,
      nearByLocation3,
      nearByLocation4,
    } = requirementData;

    let qry = "p.status = ? AND p.isActive = 1 AND p.isDeleted = 0";
    const values = ["Y"];

    // if (city) {
    //   qry += " AND p.city = ?";
    //   values.push(city);
    // }
    if (locality) {
      qry += " AND p.locality in (?)";
      values.push([
        locality,
        nearByLocation1,
        nearByLocation2,
        nearByLocation3,
        nearByLocation4,
      ]);
    }

    if (property_type) {
      qry += " AND p.property_type = ?";
      values.push(property_type);
    }

    if (property_for) {
      if (["sale", "buy"].includes(property_for)) {
        qry += " AND p.forr = ?";
        values.push("Sale");
      } else if ([("rent", "Rent/Lease")].includes(property_for)) {
        qry += " AND p.forr = ?";
        values.push("Rent/Lease");
      }
    }

    // if (bedrooms) {
    //   qry += " AND p.bedroom in (?)";
    //   values.push(bedrooms);
    // }

    // if (furnish_status) {
    //   qry += " AND p.furnish_status in (?)";
    //   values.push(furnish_status);
    // }

    if (budget_min || budget_max) {
      const col = ["rent", "Rent/Lease"].includes(property_for)
        ? "p.monthly_rent"
        : "p.exp_price";
      if (budget_min) {
        qry += ` AND ${col} >= ?`;
        values.push(budget_min);
      }
      if (budget_max) {
        qry += ` AND ${col} <= ?`;
        values.push(budget_max);
      }
    }

    // if (parking) {
    //   qry += " AND p.car_parking in (?)";
    //   values.push(
    //     parking === "Open + Covered" ? ["Open", "Covered"] : parking
    //   );
    // }

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

    /* if (floor) {
        if (floor === "Above 15") {
          qry += " AND p.floor_no > ?";
          values.push(15);
        } else {
          const tmp = floor.match(/(\d+)\s*-\s*(\d+)/);
          const min = parseInt(tmp[1]);
          const max = parseInt(tmp[2]);
          qry += " AND p.floor_no >= ? AND p.floor_no <= ?";
          values.push(min, max);
        }
      } */

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

    /* qry += " AND p.user_id != ?";
      values.push(userId); */

    qry += " AND p.postFor IN ('Community', 'CP')";

    let mainQry = qry + " GROUP BY p.id ORDER BY p.id DESC";

    const data = {};

    data.data = await sequelize.query(
      `SELECT p.id as id, p.forr, p.date, p.latitude, p.longitude, ${propertyCardFields}, pi.file as img, u.name, u.email, u.user_name as mobile, 
        CASE WHEN sh.propertyId IS NOT NULL THEN 1 ELSE 0 END AS isShortlisted
        FROM post_sale_property_hm p
        LEFT JOIN property_images_hm pi ON p.id = pi.propertyId AND pi.label = "Main Image" 
        LEFT JOIN user u ON p.ibpId = u.ibpid AND u.sub_role IS NULL 
        LEFT JOIN shortlisteds_hm sh ON p.id = sh.propertyId AND sh.userId = ?
        WHERE ${mainQry}`,
      {
        replacements: [userId, ...values],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    /* data.data.forEach((ele) => {
        ele.mobile = ele?.mobile
          ? hideMobileNumber(ele?.mobile || "")
          : ele?.mobile;
        ele.email = ele?.email
          ? hideEmailAddress(ele?.email || "")
          : ele?.email;
      }); */

    success(res, 200, data);
  } catch (err) {
    error(res, 500);
  }
};

property.updateActive = async (req, res) => {
  const { userId, ibpId, userType } = req;
  const { propertyId } = req.params;
  const { isActive } = req.body;

  try {
    const isExist = await checkPropertyExist(
      propertyId,
      userId,
      ibpId,
      userType
    );
    if (!isExist) {
      return error(res, 400, { message: messages.propertyNotFound });
    }

    const active =
      isActive == 1 || isActive == "true" || isActive == true ? 1 : 0;

    await sequelize.query(
      `UPDATE post_sale_property_hm SET isActive = ? WHERE id = ?`,
      {
        replacements: [active, propertyId],
        type: Sequelize.QueryTypes.UPDATE,
      }
    );

    return success(res, 200, {
      message: `Property has been successfully ${
        active ? "Activated" : "Deactivated"
      }.`,
    });
  } catch (err) {
    return error(res, 500);
  }
};

property.deleteProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { userId, ibpId, userType } = req;

  try {
    const isExist = await checkPropertyExist(
      propertyId,
      userId,
      ibpId,
      userType
    );
    if (!isExist) {
      return error(res, 400, { message: messages.propertyNotFound });
    }
    /* const img = await sequelize.query(
        `SELECT file FROM property_images_hm WHERE propertyId = ?`,
        {
          replacements: [propertyId],
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      const files = img.map(
        (ele) => `cp/property/original/${ele.file}`
      );
      const files1 = img.map(
        (ele) => `cp/property/small/${ele.file}`
      );

      s3.deleteFilesFromBucket([...files, ...files1]);

      await sequelize.query(
        `DELETE FROM post_sale_property_hm WHERE ${conditions}`,
        {
          replacements:
            userType === "staff" ? [propertyId] : [propertyId, userId, ibpId],
          type: Sequelize.QueryTypes.DELETE,
        }
      );
      await sequelize.query(
        `DELETE FROM property_images_hm WHERE propertyId = ?`,
        {
          replacements: [propertyId],
          type: Sequelize.QueryTypes.DELETE,
        }
      ); */

    await sequelize.query(
      `UPDATE post_sale_property_hm SET isDeleted = 1, deletedAt = NOW() WHERE id = ?`,
      {
        replacements: [propertyId],
      }
    );

    deletePropertyFromHm(propertyId);

    return success(res, 200, {
      message: messages.deleteSuccess,
    });
  } catch (err) {
    return error(res, 500);
  }
};

module.exports = property;
