const { Sequelize } = require('sequelize');
const config = require('../config/database'); 

const sequelize = new Sequelize(
  config.database,
  config.username, 
  config.password,   {
    host: config.host,
    dialect: config.dialect,
    define: config.define,
    logging: config.logging
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Database connection established'))
  .catch(err => console.error('❌ Connection error:', err));

const db = {
  sequelize,
  Sequelize,
  Payment: require('./payment')(sequelize, Sequelize.DataTypes),
};

module.exports = db;