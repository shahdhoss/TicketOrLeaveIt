const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const {sequelize} = require('./models');
const recieveMessageFromPayment = require("./messaging/receiveMessage")

const launchServer = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("events table created");
    this.expressServer = new ExpressServer(config.URL_PORT, config.OPENAPI_YAML);
    this.expressServer.launch();
    logger.info('Express server running');
  } catch (error) {
    logger.error('Express Server failure', error.message);
    await this.close();
  }
}

recieveMessageFromPayment()
launchServer().catch(e => logger.error(e));
