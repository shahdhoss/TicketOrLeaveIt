const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Test email endpoint
router.post('/test', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, and either text or html' 
      });
    }

    const result = await sendEmail({ to, subject, text, html });
    res.status(200).json({ 
      message: 'Test email sent successfully',
      id: result.id
    });
  } catch (error) {
    logger.error('Error in test endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message 
    });
  }
});

module.exports = router; 