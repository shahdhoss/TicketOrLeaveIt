const config = require('./config');
const logger = require('./logger');
const ExpressServer = require('./expressServer');
const {sequelize} = require('./models');
const express = require('express');
const app = express() 
const ticketRouter = require("./routers/ticketRouter")
const {recievingReservationFromEvents, recievingMessageFromPayment} = require("./messaging/recieveMessages");

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
app.use('/tickets', ticketRouter)
recievingReservationFromEvents()
recievingMessageFromPayment()
launchServer().catch(e => logger.error(e));
