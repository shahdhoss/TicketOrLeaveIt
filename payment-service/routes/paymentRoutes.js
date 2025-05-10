const express = require('express');
const { register } = require('../metrics/index');
const { extractUserFromToken } = require('../middleware/authMiddleware');

const router = express.Router();
const paymentController = require('../controllers/paymentController');
const webhookController = require('../controllers/webhookController');

// Public routes
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Protected routes
router.post('/initiate', extractUserFromToken, paymentController.initiatePayment);
router.post('/refund', extractUserFromToken, paymentController.refundPayment);

router.get('/payments/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
router.post('/webhook', express.json({ type: 'application/json' }), webhookController.handleWebhook);

module.exports = router;