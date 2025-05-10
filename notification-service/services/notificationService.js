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
    // For testing, use dummy data
    const data = dummyTicketData;
    
    logger.info('Processing ticket creation notification');
    
    // Send confirmation email
    await sendEmail({
      to: data.user_email,
      subject: 'Ticket Created Successfully',
      text: `Your ticket for ${data.event_name} has been created successfully.`,
      html: `
        <h1>Ticket Created Successfully</h1>
        <p>Your ticket for ${data.event_name} has been created successfully.</p>
        <p>Price: $${data.price}</p>
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
    // dummy for testing
    const data = dummyPaymentData;
    
    logger.info('Processing payment confirmation notification');
    
    // Send confirmation email
    await sendEmail({
      to: data.user_email,
      subject: 'Payment Confirmed',
      text: `Your payment for ${data.event_name} has been confirmed.`,
      html: `
        <h1>Payment Confirmed</h1>
        <p>Your payment for ${data.event_name} has been confirmed.</p>
        <p>Amount: $${data.price}</p>
        <p>Payment Method: ${data.payment_method}</p>
        <p>Payment Date: ${data.payment_date}</p>
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