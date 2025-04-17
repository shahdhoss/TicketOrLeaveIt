// config/db.config.js
require('dotenv').config({ path: '../.env' }); // Specify path to .env relative to this file

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USERNAME,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_DATABASE,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
  pool: { // Optional: Configure connection pooling
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};