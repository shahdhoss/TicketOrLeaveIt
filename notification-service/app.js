require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const notificationRoutes = require('./routes/notificationRoutes');
const {recieveEventInfo} = require("./messaging/receiveMessages")
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 8083;
recieveEventInfo()
app.listen(PORT, () => {
  logger.info(`Notification service listening on port ${PORT}`);
});

module.exports = app; 