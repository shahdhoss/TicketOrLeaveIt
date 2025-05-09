const express = require('express');
const { register } = require('../metrics/index');

const router = express.Router();
const paymentController = require('../controllers/paymentController');
const webhookController = require('../controllers/webhookController');

router.post('/payments', paymentController.initiatePayment);
router.post('/payments/refund/:id', paymentController.refundPayment);
router.get("/health",paymentController.checkHealth)
router.get('/payments/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
router.post('/webhook', express.json({ type: 'application/json' }), webhookController.handleWebhook);

module.exports = router;