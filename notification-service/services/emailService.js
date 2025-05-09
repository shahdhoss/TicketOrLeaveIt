const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter;

function setupEmailService() {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      logger.error('SMTP connection error:', error);
    } else {
      logger.info('SMTP server is ready to take our messages');
    }
  });
}

async function sendTicketEmail(userEmail, ticketData) {
  const { ticketId, eventName, paymentMethod, amount } = ticketData;

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: 'Your Ticket Purchase Confirmation',
    html: `
      <h1>Thank you for your purchase!</h1>
      <p>Your ticket has been successfully purchased.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h2>Ticket Details:</h2>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Event:</strong> ${eventName}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Amount Paid:</strong> ${amount} EGP</p>
      </div>
      <p>Please keep this email for your records. You can use the Ticket ID to access your ticket.</p>
      <p>Thank you for choosing our service!</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  setupEmailService,
  sendTicketEmail
}; 