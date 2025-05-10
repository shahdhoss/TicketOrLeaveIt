const { Resend } = require('resend');
const logger = require('../utils/logger');

if (!process.env.RESEND_API_KEY) {
  logger.error('RESEND_API_KEY is not configured in environment variables');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    logger.info('Sending email:', { to, subject });

    const data = {
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to,
      subject,
      text,
      html
    };

    const response = await resend.emails.send(data);
    logger.info('Email sent successfully:', { id: response.id });
    return response;
  } catch (error) {
    logger.error('Error sending email:', {
      message: error.message,
      statusCode: error.statusCode
    });
    throw error;
  }
};

module.exports = {
  sendEmail
}; 