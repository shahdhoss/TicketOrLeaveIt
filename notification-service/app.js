require('dotenv').config();
const express = require('express');
const amqp = require('amqplib');
const { setupEmailService } = require('./services/emailService');
const { handlePaymentConfirmation } = require('./services/notificationService');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 8083;


setupEmailService();

// Setup RabbitMQ consumer
async function setupRabbitMQ() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    
    // Listen to ticket creation
    const ticketExchange = 'confirmTicket';
    const ticketQueue = 'notificationTicketQueue';
    const ticketRoutingKey = 'tickets->payment';

    await channel.assertExchange(ticketExchange, 'direct', { durable: true });
    await channel.assertQueue(ticketQueue, { durable: true });
    await channel.bindQueue(ticketQueue, ticketExchange, ticketRoutingKey);

    // Listen to payment confirmation
    const paymentExchange = 'eventReservation';
    const paymentQueue = 'notificationPaymentQueue';
    const paymentRoutingKey = 'payment->events';

    await channel.assertExchange(paymentExchange, 'direct', { durable: true });
    await channel.assertQueue(paymentQueue, { durable: true });
    await channel.bindQueue(paymentQueue, paymentExchange, paymentRoutingKey);

    logger.info('RabbitMQ connections established');

    // Handle ticket creation messages
    channel.consume(ticketQueue, async (message) => {
      if (message !== null) {
        const data = JSON.parse(message.content.toString());
        logger.info('Received ticket creation:', data);
        
        try {
          // Store ticket info for later use when payment is confirmed
          await handleTicketCreation(data);
          channel.ack(message);
        } catch (error) {
          logger.error('Error processing ticket creation:', error);
          channel.nack(message, false, true);
        }
      }
    });

    // Handle payment confirmation messages
    channel.consume(paymentQueue, async (message) => {
      if (message !== null) {
        const data = JSON.parse(message.content.toString());
        logger.info('Received payment confirmation:', data);
        
        try {
          await handlePaymentConfirmation(data);
          channel.ack(message);
        } catch (error) {
          logger.error('Error processing payment confirmation:', error);
          channel.nack(message, false, true);
        }
      }
    });
  } catch (error) {
    logger.error('RabbitMQ connection error:', error);
    setTimeout(setupRabbitMQ, 5000);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Notification service running on port ${PORT}`);
  setupRabbitMQ();
}); 