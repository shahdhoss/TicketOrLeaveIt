const amqp = require('amqplib');
const logger = require('../utils/logger');
const { handleTicketCreation, handlePaymentConfirmation } = require('../services/notificationService');

const startConsuming = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Declare exchanges
    await channel.assertExchange('ticketCreation', 'topic', { durable: true });
    await channel.assertExchange('paymentConfirmation', 'topic', { durable: true });

    // Declare queues
    await channel.assertQueue('ticket_creation_notifications', { durable: true });
    await channel.assertQueue('payment_confirmation_notifications', { durable: true });

    // Bind queues to exchanges
    await channel.bindQueue('ticket_creation_notifications', 'ticketCreation', 'tickets->notification');
    await channel.bindQueue('payment_confirmation_notifications', 'paymentConfirmation', 'payment->notification');

    // Consume ticket creation messages
    channel.consume('ticket_creation_notifications', async (msg) => {
      try {
        const content = JSON.parse(msg.content.toString());
        logger.info('Received ticket creation message:', content);
        await handleTicketCreation(content);
        channel.ack(msg);
      } catch (error) {
        logger.error('Error processing ticket creation message:', error);
        channel.nack(msg, false, true);
      }
    });

    // Consume payment confirmation messages
    channel.consume('payment_confirmation_notifications', async (msg) => {
      try {
        const content = JSON.parse(msg.content.toString());
        logger.info('Received payment confirmation message:', content);
        await handlePaymentConfirmation(content);
        channel.ack(msg);
      } catch (error) {
        logger.error('Error processing payment confirmation message:', error);
        channel.nack(msg, false, true);
      }
    });

    logger.info('Notification service started consuming messages');
  } catch (error) {
    logger.error('Error starting message consumer:', error);
    throw error;
  }
};

module.exports = {
  startConsuming
}; 