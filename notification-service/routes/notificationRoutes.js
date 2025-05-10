const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const redisClient = require('../redisClient');
const { handleEventNotification } = require('../services/notificationService');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* Send notification email by ticket_id
router.post('/send/:ticket_id', async (req, res) => {
  const ticketId = req.params.ticket_id;
  try {
    const data = await redisClient.get(`ticket:${ticketId}`);
    if (!data) {
      return res.status(404).json({ error: 'Ticket data not found in Redis' });
    }
    const eventData = JSON.parse(data);
    await handleEventNotification(eventData);
    res.status(200).json({ message: 'Notification email sent successfully' });
  } catch (error) {
    logger.error('Error sending notification email:', error);
    res.status(500).json({ error: 'Failed to send notification email', details: error.message });
  }
});*/

// Send notification email for the latest ticket
router.post('/send', async (req, res) => {
  try {
    const keys = await redisClient.keys('ticket:*');
    if (!keys || keys.length === 0) {
      return res.status(404).json({ error: 'No ticket data found in Redis' });
    }
    // Use the last key as the latest
    const latestKey = keys[keys.length - 1];
    const data = await redisClient.get(latestKey);
    if (!data) {
      return res.status(404).json({ error: 'Latest ticket data not found in Redis' });
    }
    const eventData = JSON.parse(data);
    await handleEventNotification(eventData);
    res.status(200).json({ message: 'Notification email sent for latest ticket', ticket_id: eventData.ticket_id });
  } catch (error) {
    logger.error('Error sending notification email for latest ticket:', error);
    res.status(500).json({ error: 'Failed to send notification email for latest ticket', details: error.message });
  }
});

module.exports = router; 