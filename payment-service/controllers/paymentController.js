const { Payment } = require('../models');
const PaymobService = require('../services/paymobService');

exports.initiatePayment = async (req, res) => {
  const startTime = Date.now();
  console.log(`\n=== NEW PAYMENT REQUEST ===\n${JSON.stringify(req.body, null, 2)}`);

  try {
    const { userId, eventId, amount } = req.body;

    
    if (!userId || !eventId || !amount || isNaN(amount) || amount < 1) {
      console.error('❌ Validation Failed:', { userId, eventId, amount });
      return res.status(400).json({
        success: false,
        error: "Invalid request. Requires userId (number), eventId (number), amount (≥1 EGP)"
      });
    }

    const paymentData = await PaymobService.createPayment(amount, userId, eventId);
    
    await Payment.create({
      userId,
      eventId,
      amount,
      paymobOrderId: paymentData.orderId,
    });

    console.log(`\n✅ Payment Initiated in ${Date.now() - startTime}ms`);
    res.json({ 
      success: true,
      paymentUrl: paymentData.paymentUrl,
      orderId: paymentData.orderId
    });

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