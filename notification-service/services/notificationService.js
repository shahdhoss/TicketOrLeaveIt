const { sendEmail } = require('./emailService');
const logger = require('../utils/logger');

async function handleTicketCreation(data) {
  try {
    const { user_id, event_id, user_email, event_name, price } = data;
    
    if (!user_email || !event_name || !price) {
      throw new Error('Missing required ticket data');
    }

    logger.info('Processing ticket creation notification', { user_id, event_id });
    
    // Send ticket creation email
    await sendEmail({
      to: user_email,
      subject: 'Ticket Created Successfully',
      text: `Your ticket for ${event_name} has been created. Amount: $${price}`,
      html: `
        <h1>Ticket Created Successfully</h1>
        <p>Your ticket for ${event_name} has been created.</p>
        <p>Amount: $${price}</p>
        <p>Please complete the payment to confirm your ticket.</p>
      `
    });

    logger.info('Ticket creation email sent successfully', { user_id, event_id });
  } catch (error) {
    logger.error('Error handling ticket creation:', error);
    throw error;
  }
}

async function handlePaymentConfirmation(data) {
  try {
    const { 
      user_id, 
      event_id, 
      user_email, 
      event_name, 
      price,
      payment_id,
      payment_method,
      payment_date
    } = data;

    if (!user_email || !event_name || !price) {
      throw new Error('Missing required payment data');
    }

    logger.info('Processing payment confirmation notification', { user_id, event_id, payment_id });

    // Send payment confirmation email
    await sendEmail({
      to: user_email,
      subject: 'Payment Confirmed - Ticket Ready',
      text: `Your payment for ${event_name} has been confirmed. Amount: $${price}`,
      html: `
        <h1>Payment Confirmed</h1>
        <p>Your payment for ${event_name} has been confirmed.</p>
        <p>Amount: $${price}</p>
        <p>Payment Method: ${payment_method}</p>
        <p>Payment Date: ${new Date(payment_date).toLocaleString()}</p>
        <p>Your ticket is now ready!</p>
      `
    });

    logger.info('Payment confirmation email sent successfully', { user_id, event_id, payment_id });
  } catch (error) {
    logger.error('Error handling payment confirmation:', error);
    throw error;
  }
}

module.exports = {
  handleTicketCreation,
  handlePaymentConfirmation
}; 