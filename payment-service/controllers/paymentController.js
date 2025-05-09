const { Payment } = require('../models');
const PaymobService = require('../services/paymobService');
const redisClient = require("../redisClient");
const isHealthy = require("../messaging/checkHealth")
const updateEventReservation = require("../messaging/sendMessage")
const { paymentMetrics } = require('../metrics/index');

exports.initiatePayment = async (req, res) => {
  const startTime = Date.now();
  console.log(`\n=== NEW PAYMENT REQUEST ===\n${JSON.stringify(req.body, null, 2)}`);

  try {
     paymentMetrics.requests.labels('POST', 'started').inc();
    paymentMetrics.amounts.observe(req.body.amount);
    paymentMetrics.requests.labels('POST', 'started').inc();
    paymentMetrics.amounts.observe(req.body.amount);
    const payment_queue = "paymentMessages"
    const {userId , amount } = req.body;
    const eventId = await redisClient.get(`reservation:${userId}`)
    console.log("success from redis: ", eventId)
    if (!userId || !eventId || !amount || isNaN(amount) || amount < 1) {
      console.error('❌ Validation Failed:', { userId, eventId, amount });
      return res.status(400).json({
        success: false,
        error: "Invalid request. Requires userId (number), eventId (number), amount (≥1 EGP)"
      });
    }
    if(isHealthy(payment_queue)){
      const paymentData = await PaymobService.createPayment(amount, userId, eventId);
      console.log("payment data: ", paymentData)
      await Payment.create({
        userId,
        eventId,
        amount,
        paymobOrderId: paymentData.orderId,
      });

      console.log(`\n✅ Payment Initiated in ${Date.now() - startTime}ms`);
      const message = {user_id: userId, event_id: eventId}
      sendReservationToTickets(message)
      paymentMetrics.requests.labels('POST', 'success').inc();
    endTimer();
      return res.json({ 
        success: true,
        paymentUrl: paymentData.paymentUrl,
        orderId: paymentData.orderId
      });
  }
  res.status({success:false})
  
} catch (error) {
  paymentMetrics.requests.labels('POST', 'error').inc();
    endTimer();
    console.error('\n❌ CONTROLLER ERROR:', {
      error: error.message,
      stack: error.stack,
      duration: `${Date.now() - startTime}ms`
    });
    
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack
      } : undefined
    });
  }
};
exports.refundPayment = async (req, res) => {
    const endTimer = paymentMetrics.refundDuration.startTimer();

  const { id } = req.params;

  console.log(`\n🔁 Initiating refund for payment ID: ${id}`);

  try {
        paymentMetrics.refunds.labels('attempted').inc();

    const payment = await Payment.findByPk(id);

    if (!payment) {
      console.error(`❌ Payment not found with ID: ${id}`);
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    payment.isVerified = 'refunded';
    await payment.save();
 paymentMetrics.refunds.labels('success').inc();
    endTimer();
    console.log(`✅ Payment ID ${id} marked as refunded.`);
    res.json({
      success: true,
      message: `Payment ID ${id} refunded successfully`,
    });

  } catch (error) {
    paymentMetrics.refunds.labels('failed').inc();
    endTimer();
    console.error(`❌ Refund Error for Payment ID ${id}:`, error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
