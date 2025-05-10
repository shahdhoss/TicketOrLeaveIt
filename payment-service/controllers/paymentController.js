const { Payment } = require('../models');
const PaymobService = require('../services/paymobService');
const redisClient = require("../redisClient");
const isHealthy = require("../messaging/checkHealth")
const {updateTicketReservation, updateEventCapacityandReservationStatus}= require("../messaging/sendMessage")
const axios = require("axios");
const { paymentMetrics } = require('../metrics/index');

exports.initiatePayment = async (req, res) => {
  // const endTimer = paymentMetrics.processDuration.startTimer();
  console.log(`\n=== NEW PAYMENT REQUEST ===\n${JSON.stringify(req.body, null, 2)}`);
  try {
    // paymentMetrics.requests.labels('POST', 'started').inc();
    // paymentMetrics.amounts.observe(req.body.amount);
    // paymentMetrics.requests.labels('POST', 'started').inc();
    // paymentMetrics.amounts.observe(req.body.amount);
    const ticketsQueue = "updatedTickets"
    const eventsQueue = "eventMessages"
   
    const {ticketId} = req.body
    const payment_info = await redisClient.get(`reservation:${ticketId}`)
    if (!payment_info){
        throw new Error('Reservation not found in Redis');
    }
    const {event_id, user_id, reservation_id, amount} = JSON.parse(payment_info)
    console.log("success from redis: ", event_id)

    if (!event_id || !user_id || !amount || isNaN(amount) || amount < 1) {
      console.error('❌ Validation Failed:', { user_id, event_id, amount });
      return res.status(400).json({
        success: false,
        error: "Invalid request. Requires userId (number), eventId (number), amount (≥1 EGP)"
      });
    }

    const eventsHealth = await axios.get("http://localhost/v1/events/health")
    const ticketsHealth = await axios.get("http://localhost/v1/tickets/health")
    
    if(isHealthy(ticketsQueue) && isHealthy(eventsQueue) && eventsHealth.status === 200 && ticketsHealth.status === 200){       //a bit of coupling but its better than reserving a non existent seat
      const paymentData = await PaymobService.createPayment(amount, user_id, event_id);
      console.log("payment data: ", paymentData)
      await Payment.create({
        userId: user_id,
        eventId: event_id,
        amount,
        paymobOrderId: paymentData.orderId,
        reservationId: reservation_id,
        ticketId: ticketId
      });

      const updated_ticket_status = {user_id: user_id, event_id: event_id, ticket_id: ticketId, message: "confirmed"}
      const updated_capacity = {user_id: user_id, event_id: event_id, reservation_id:reservation_id, message: "Decrement", payment_id: paymentData.orderId, ticket_id: ticketId }
      updateTicketReservation(updated_ticket_status)
      updateEventCapacityandReservationStatus(updated_capacity)
      // paymentMetrics.requests.labels('POST', 'success').inc();
      // endTimer();
      return res.json({ 
        success: true,
        paymentUrl: paymentData.paymentUrl,
        orderId: paymentData.orderId
      });
  }
  const message = {user_id: user_id, event_id: event_id, ticketId: ticketId, message: "failed" }
  updateTicketReservation(message)
  res.status({success:false})
  
} catch (error) {
  // paymentMetrics.requests.labels('POST', 'error').inc();
  //  endTimer();
    console.error('\n❌ CONTROLLER ERROR:', {
      error: error.message,
      stack: error.stack,
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
  // const endTimer = paymentMetrics.refundDuration.startTimer();
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
    
    //declining the ticket and the reservation
    const { id: paymentId, userId, eventId, amount, paymobOrderId, isVerified, reservationId, ticketId, createdAt, updatedAt } = payment.get({ plain: true });
    const updated_ticket_status = {user_id: userId, event_id: eventId, ticket_id: ticketId, message: "failed"}
    const updated_capacity = {user_id: userId, event_id: eventId, reservation_id:reservationId, message: "Increment", payment_id: paymobOrderId, ticket_id: ticketId }
    updateTicketReservation(updated_ticket_status)
    updateEventCapacityandReservationStatus(updated_capacity)
    
    // endTimer();
    console.log(`✅ Payment ID ${id} marked as refunded.`);
    res.json({
      success: true,
      message: `Payment ID ${id} refunded successfully`,
    });

  } catch (error) {
    paymentMetrics.refunds.labels('failed').inc();
    // endTimer();
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