const CryptoJs = require("crypto-js");
const config = require("../api/config");

const encryption = (val) => {
  try {
    return CryptoJs.AES.encrypt(
      JSON.stringify(val),
      config.CRYPTO_KEY
    ).toString();
  } catch (err) {
    return null;
  }
};

const decryption = (val) => {
  try {
    const decStr = CryptoJs.AES.decrypt(val, config.CRYPTO_KEY).toString(
      CryptoJs.enc.Utf8
    );
    return JSON.parse(decStr);
  } catch (err) {
    console.log(err);
    return null;
  }
};

const decrypt = (req, res, next) => {
  if (req.body?.data) {
    req.body = { ...req.body, ...decryption(req.body.data) };
  }
  next();
};

function md5(input) {
  return CryptoJs.MD5(input).toString(CryptoJs.enc.Hex);
}

const generateEncryptedToken = (data) => {
  try {
    return CryptoJs.AES.encrypt(
      JSON.stringify(data),
      config.TOKEN_CRYPTO_KEY
    ).toString();
  } catch (err) {
    return null;
  }
};

module.exports = {
  encryption,
  decryption,
  decrypt,
  md5,
  generateEncryptedToken,
};
