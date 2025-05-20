require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL,
  auth: {
    username: process.env.BASIC_AUTH_USER,
    password: process.env.BASIC_AUTH_PASS
  }
};
