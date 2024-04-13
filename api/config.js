module.exports = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL,
  SERVER_URL: process.env.SERVER_URL,
  HM_SERVER_URL: process.env.HM_SERVER_URL,
  AWS_URL: process.env.AWS_URL,
  DATABASE: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME,
  },
  JWT_SECRET:
    process.env.JWT_SECRET || "aCUUJkEIe6sU8urSmx5jTNxdtFwgCF0rbUpXnLk1NmBZNw",
  CRYPTO_KEY: process.env.CRYPTO_KEY,
  TOKEN_CRYPTO_KEY: process.env.TOKEN_CRYPTO_KEY,
  GOOGLE_MAP_API: process.env.GOOGLE_MAP_API,
  GOOGLE_CLIENT: process.env.GOOGLE_CLIENT,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK,
  FACEBOOK_ID: process.env.FACEBOOK_ID,
  FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
  FACEBOOK_CALLBACK: process.env.FACEBOOK_CALLBACK,
  LOGIN_SUCCESS: process.env.LOGIN_SUCCESS,
  LOGIN_FAIL: process.env.LOGIN_FAIL,
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: process.env.MAIL_PORT,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
  MAIL_FROM: process.env.MAIL_FROM,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_BUCKET: process.env.AWS_BUCKET,
  RESET_VALID_TIME: 30,
};
