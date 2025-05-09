require('dotenv').config();
const express = require('express');
const { setupEmailService } = require('./services/emailService');
const setupMessageConsumers = require('./messaging/receiveMessages');
const notificationRoutes = require('./routes/notificationRoutes');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 8083;

// Setup email service
setupEmailService();

// Setup RabbitMQ consumers
setupMessageConsumers();

// Use notification routes
app.use('/api/v1/notifications', notificationRoutes);

// Start server
app.listen(PORT, () => {
  logger.info(`Notification service listening on port ${PORT}`);
}); 