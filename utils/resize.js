const sharp = require("sharp");

const resizeImage = (bufferData, size, quality) => {
  return new Promise(async (resolve) => {
    try {
      const image = sharp(bufferData);

      const desiredWidth = size[0];
      const desiredHeight = size[1];

      const metadata = await image.metadata();
      const originalWidth = metadata.width;
      const originalHeight = metadata.height;

      let newWidth, newHeight;
      if (originalWidth > originalHeight) {
        newWidth = desiredWidth;
        newHeight = Math.floor((originalHeight / originalWidth) * desiredWidth);
      } else {
        newWidth = Math.floor((originalWidth / originalHeight) * desiredHeight);
        newHeight = desiredHeight;
      }

      const buffer = await image
        .resize(newWidth, newHeight)
        .jpeg({ quality })
        .toBuffer();

      resolve(buffer);
    } catch (err) {
      resolve(null);
    }
  });
};

module.exports = { resizeImage };
