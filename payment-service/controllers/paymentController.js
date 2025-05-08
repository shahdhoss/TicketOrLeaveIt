const { Payment } = require('../models');
const PaymobService = require('../services/paymobService');
const redisClient = require("../redisClient");
const isHealthy = require("../messaging/checkHealth")
const sendReservationToTickets = require("../messaging/sendMessage")

exports.initiatePayment = async (req, res) => {
  const startTime = Date.now();
  console.log(`\n=== NEW PAYMENT REQUEST ===\n${JSON.stringify(req.body, null, 2)}`);

  try {
    const ticketing_queue = "ticket-reservation-confirmation"
    const {userId ,amount } = req.body;
    const eventId = await redisClient.get(`reservation:${userId}`)
    console.log("success from redis: ", eventId)
    if (!userId || !eventId || !amount || isNaN(amount) || amount < 1) {
      console.error('❌ Validation Failed:', { userId, eventId, amount });
      return res.status(400).json({
        success: false,
        error: "Invalid request. Requires userId (number), eventId (number), amount (≥1 EGP)"
      });
    }
    if(isHealthy(ticketing_queue)){
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
      
      return res.json({ 
        success: true,
        paymentUrl: paymentData.paymentUrl,
        orderId: paymentData.orderId
      });
  }
  res.status({success:false})
  
} catch (error) {
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