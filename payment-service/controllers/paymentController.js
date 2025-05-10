const { Payment } = require('../models');
const PaymobService = require('../services/paymobService');
const redisClient = require("../redisClient");
const isHealthy = require("../messaging/checkHealth")
const {updateTicketReservation, updateEventCapacityandReservationStatus, sendPaymentConfirmation} = require("../messaging/sendMessage")
const axios = require("axios")
const { paymentMetrics } = require('../metrics/index');
const logger = require('../utils/logger');


exports.initiatePayment = async (req, res) => {
  const startTime = Date.now();
  logger.info(`New payment request: ${JSON.stringify(req.body)}`);
  
  try {
    paymentMetrics.requests.labels('POST', 'started').inc();
    paymentMetrics.amounts.observe(req.body.amount);
    
    const {ticketId} = req.body;
    if (!ticketId) {
      return res.status(400).json({
        success: false,
        error: "Ticket ID is required"
      });
    }

    const payment_info = await redisClient.get(`reservation:${ticketId}`);
    if (!payment_info) {
      logger.error(`Reservation not found for ticket ID: ${ticketId}`);
      return res.status(404).json({
        success: false,
        error: 'Reservation not found'
      });
    }

    const {event_id, user_id, reservation_id, amount} = JSON.parse(payment_info);
    logger.info(`Retrieved payment info from Redis:`, { event_id, user_id, amount });

    if (!event_id || !user_id || !amount || isNaN(amount) || amount < 1) {
      logger.error('Invalid payment data:', { user_id, event_id, amount });
      return res.status(400).json({
        success: false,
        error: "Invalid request. Requires valid userId, eventId, and amount (≥1 EGP)"
      });
    }

    // Get event details
    let eventData;
    try {
      const eventResponse = await axios.get(`http://events-service:8080/v1/events/${event_id}`);
      eventData = eventResponse.data.event;
    } catch (error) {
      logger.error(`Failed to fetch event details: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch event details"
      });
    }

    // Get user details
    let userData;
    try {
      const userResponse = await axios.get(`http://user-service:8080/v1/users/${user_id}`);
      userData = userResponse.data.user;
    } catch (error) {
      logger.error(`Failed to fetch user details: ${error.message}`);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch user details"
      });
    }

    // Create payment record
    const payment = await Payment.create({
      userId: user_id,
      eventId: event_id,
      amount: amount,
      paymobOrderId: null,
      isVerified: 'false'
    });

    // Send payment confirmation to notification service
    try {
      await sendPaymentConfirmation({
        payment_id: payment.id,
        user_id: user_id,
        user_email: userData.email,
        event_id: event_id,
        event_name: eventData.type,
        ticket_id: ticketId,
        amount: amount,
        payment_date: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Failed to send payment confirmation: ${error.message}`);
      // Continue with payment process even if notification fails
    }

    // Update ticket and event status
    try {
      await updateTicketReservation({
        ticket_id: ticketId,
        payment_id: payment.id,
        status: 'confirmed'
      });

      await updateEventCapacityandReservationStatus({
        event_id: event_id,
        reservation_id: reservation_id,
        status: 'confirmed'
      });
    } catch (error) {
      logger.error(`Failed to update ticket/event status: ${error.message}`);
      // Continue with payment process even if status updates fail
    }

    const duration = Date.now() - startTime;
    paymentMetrics.requestDuration.observe(duration);
    paymentMetrics.requests.labels('POST', 'success').inc();

    res.status(200).json({
      success: true,
      payment_id: payment.id,
      message: "Payment initiated successfully"
    });

  } catch (error) {
    logger.error('Payment initiation error:', error);
    paymentMetrics.requests.labels('POST', 'failed').inc();
    res.status(500).json({
      success: false,
      error: error.message || "Payment initiation failed"
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

exports.checkHealth = async (req, res) => {
  try{
    res.status(200).json({status: "ok"})
  } catch(error){
    res.status(500)
  }
}