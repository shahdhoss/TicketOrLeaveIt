const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Get notification service status
router.get('/status', (req, res) => {
  res.status(200).json({
    status: 'operational',
    service: 'notification-service',
    version: '1.0.0'
  });
});

module.exports = router; 