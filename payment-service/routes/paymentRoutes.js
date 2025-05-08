const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const webhookController = require('../controllers/webhookController');

router.post('/payments', paymentController.initiatePayment);
router.post('/payments/refund/:id', paymentController.refundPayment);

router.post('/webhook', express.json({ type: 'application/json' }), webhookController.handleWebhook);

module.exports = router;