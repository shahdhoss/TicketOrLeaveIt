const express = require('express');
const router = express.Router();
const { handleTicketCreation, handlePaymentConfirmation } = require('../services/notificationService');
const logger = require('../utils/logger');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Test ticket creation notification
router.post('/test/ticket', async (req, res) => {
  try {
    await handleTicketCreation();
    res.status(200).json({ message: 'Test ticket notification sent successfully' });
  } catch (error) {
    logger.error('Error in ticket test endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to send test ticket notification',
      details: error.message 
    });
  }
});

// Test payment confirmation notification
router.post('/test/payment', async (req, res) => {
  try {
    await handlePaymentConfirmation();
    res.status(200).json({ message: 'Test payment notification sent successfully' });
  } catch (error) {
    logger.error('Error in payment test endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to send test payment notification',
      details: error.message 
    });
  }
});

module.exports = router; 