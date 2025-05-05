const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const express = require("express");
const app = express();
const { sequelize } = require('./models');
const vendorRouter = require('./routers/vendorRouter');
const { startServer } = require('./grpcServer');

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

sequelize.sync({ alter: true }).then(() => {
  console.log("Tables created");
}).catch((error) => {
  console.error(error);
});

app.use(express.json());
app.use('/vendor', vendorRouter);

launchServer().catch(e => logger.error(e));
startServer('0.0.0.0:50051');


