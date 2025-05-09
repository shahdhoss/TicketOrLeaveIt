const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

let transporter;

function setupEmailService() {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  logger.info('Email service initialized');
}

async function sendEmail({ to, subject, text, html }) {
  try {
    if (!transporter) {
      throw new Error('Email service not initialized');
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info('Email sent successfully', { messageId: info.messageId });
    return info;
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  setupEmailService,
  sendEmail
}; 