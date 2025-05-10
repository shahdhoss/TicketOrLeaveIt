const { sendEmail } = require('./emailService');
const logger = require('../utils/logger');

// Dummy data for testing
const dummyTicketData = {
  user_email: 'sportofolioapp@gmail.com',
  event_name: 'Test Event',
  price: 100,
  user_id: '123',
  event_id: '456'
};

const dummyPaymentData = {
  user_email: 'sportofolioapp@gmail.com',
  event_name: 'Test Event',
  price: 100,
  payment_method: 'Credit Card',
  payment_date: new Date().toISOString()
};

const handleTicketCreation = async (ticketData) => {
  try {
    logger.info('Processing ticket creation notification:', ticketData);
    
    // Send confirmation email
    await sendEmail({
      to: ticketData.user_email,
      subject: 'Ticket Created Successfully',
      text: `Your ticket for ${ticketData.event_name} has been created successfully.`,
      html: `
        <h1>Ticket Created Successfully</h1>
        <p>Your ticket for ${ticketData.event_name} has been created successfully.</p>
        <p>Ticket ID: ${ticketData.ticket_id}</p>
        <p>Price: $${ticketData.price}</p>
      `
    });

    logger.info('Ticket creation notification sent successfully');
  } catch (error) {
    logger.error('Error sending ticket creation notification:', error);
    throw error;
  }
};

const handlePaymentConfirmation = async (paymentData) => {
  try {
    logger.info('Processing payment confirmation notification:', paymentData);
    
    // Send confirmation email
    await sendEmail({
      to: paymentData.user_email,
      subject: 'Payment Confirmed',
      text: `Your payment for ${paymentData.event_name} has been confirmed.`,
      html: `
        <h1>Payment Confirmed</h1>
        <p>Your payment for ${paymentData.event_name} has been confirmed.</p>
        <p>Payment ID: ${paymentData.payment_id}</p>
        <p>Ticket ID: ${paymentData.ticket_id}</p>
        <p>Amount: $${paymentData.amount}</p>
        <p>Payment Date: ${paymentData.payment_date}</p>
      `
    });

    logger.info('Payment confirmation notification sent successfully');
  } catch (error) {
    logger.error('Error sending payment confirmation notification:', error);
    throw error;
  }
};

module.exports = {
  handleTicketCreation,
  handlePaymentConfirmation
}; 