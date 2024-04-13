const {
  S3Client,
  DeleteObjectsCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const config = require("../api/config");

const s3 = new S3Client({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
  },
});

const s3Config = {
  s3: s3,
  bucket: config.AWS_BUCKET,
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
};

const uploadPropOriginal = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: config.AWS_BUCKET,
        ACL: "public-read",
        ContentType: "image/jpeg",
        Key: `cp/property/original/${data.fileName}`,
        Body: data.file,
      };
      await s3.send(new PutObjectCommand(params));
      resolve();
    } catch (err) {
      reject();
    }
  });
};

const uploadPropSmall = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: config.AWS_BUCKET,
        ACL: "public-read",
        ContentType: "image/jpeg",
        Key: `cp/property/small/${data.fileName}`,
        Body: data.file,
      };
      await s3.send(new PutObjectCommand(params));
      resolve();
    } catch (err) {
      reject();
    }
  });
};

const uploadPropVideo = (data) => {
  const params = {
    Bucket: config.AWS_BUCKET,
    ACL: "public-read",
    ContentType: "video/mp4",
    Key: `cp/property/video/${data.fileName}`,
    Body: data.file,
  };
  s3.send(new PutObjectCommand(params));
};

const uploadSupportFile = multer({
  storage: multerS3({
    ...s3Config,
    key: function (req, file, cb) {
      const ext = file.originalname.split(".").pop();
      cb(
        null,
        `cp/support/${Math.floor(
          Math.random() * 100000
        )}${Date.now().toString()}.${ext}`
      );
    },
  }),
}).array(["files"]);

const deleteFilesFromBucket = async (fileNames) => {
  const params = {
    Bucket: config.AWS_BUCKET,
    Delete: {
      Objects: fileNames.map((fileName) => ({ Key: fileName })),
    },
  };

  try {
    const command = new DeleteObjectsCommand(params);
    const response = await s3.send(command);
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};

module.exports = {
  uploadPropOriginal,
  uploadPropSmall,
  uploadPropVideo,
  deleteFilesFromBucket,
  uploadSupportFile,
};
