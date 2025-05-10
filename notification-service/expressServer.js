const express = require('express');
const { startConsuming } = require('./messaging/receiveMessages');
const logger = require('./utils/logger');

class ExpressServer {
  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  async start() {
    try {
      // Start consuming messages
      await startConsuming();
      
      // Start the server
      const port = process.env.PORT || 3000;
      this.app.listen(port, () => {
        logger.info(`Notification service listening on port ${port}`);
      });
    } catch (error) {
      logger.error('Failed to start notification service:', error);
      process.exit(1);
    }
  }
}

module.exports = ExpressServer; 