const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const express = require("express")
const app = express()
const db = require("./models");
db.sequelize.authenticate()
  .then(() => {
    logger.info('✅ PostgreSQL Connection has been established successfully.');
  })
  .catch(err => {
    logger.error('❌ Unable to connect to the PostgreSQL database:', err);
  });
const launchServer = async () => {
  try {
    this.expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
    this.expressServer.launch();
    logger.info('Express server running');
  } catch (error) {
    logger.error('Express Server failure', error.message);
    await this.close();
  } 
};
launchServer().catch(e => logger.error(e));
