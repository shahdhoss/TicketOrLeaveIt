const { sendEmail } = require('./emailService');
const logger = require('../utils/logger');

const handleEventNotification = async (eventData) => {
  try {
    logger.info('Processing event notification');

    // email content
    const subject = 'Your ticket was confirmed';
    const text = `Your ticket was confirmed\n\nTicket ID: ${eventData.ticket_id}\nEvent ID: ${eventData.id}\nCity: ${eventData.city}\nDate: ${eventData.date}\nAddress: ${eventData.address}\nDescription: ${eventData.description}`;
    const html = `
      <h2>Your ticket was confirmed</h2>
      <ul>
        <li><strong>Ticket ID:</strong> ${eventData.ticket_id}</li>
        <li><strong>Event ID:</strong> ${eventData.id}</li>
        <li><strong>City:</strong> ${eventData.city}</li>
        <li><strong>Date:</strong> ${eventData.date}</li>
        <li><strong>Address:</strong> ${eventData.address}</li>
        <li><strong>Description:</strong> ${eventData.description}</li>
      </ul>
    `;

    await sendEmail({
      to: 'sportofolioapp@gmail.com',
      subject,
      text,
      html
    });

    logger.info('Event notification email sent successfully');
  } catch (error) {
    logger.error('Error sending event notification email:', error);
    throw error;
  }
};

module.exports = {
  handleEventNotification
}; 