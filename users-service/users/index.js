const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const {sequelize} = require('./models');
const app = require("./app")

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

sequelize.sync({alter:true}).then(() => {
  console.log("users table created");
}).catch((error) => {
  console.error(error);
})

launchServer().catch(e => logger.error(e));
