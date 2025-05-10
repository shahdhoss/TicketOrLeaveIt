const amqp = require('amqplib');
const logger = require('../utils/logger');
const { usersPOST } = require('./DefaultService');

class MessageConsumer {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      
      // Declare queues
      await this.channel.assertQueue('user_creation', { durable: true });
      
      logger.info('Connected to RabbitMQ');
    } catch (error) {
      logger.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async startConsuming() {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.consume('user_creation', async (msg) => {
        if (msg !== null) {
          try {
            const message = JSON.parse(msg.content.toString());
            logger.info('Received message:', message);

            if (message.type === 'USER_CREATION') {
              // Process user creation
              await usersPOST({ body: message.data });
              logger.info('Processed user creation for:', message.data.email);
            }

            this.channel.ack(msg);
          } catch (error) {
            logger.error('Error processing message:', error);
            // Reject message and requeue
            this.channel.nack(msg, false, true);
          }
        }
      });

      logger.info('Started consuming messages');
    } catch (error) {
      logger.error('Failed to start consuming messages:', error);
      throw error;
    }
  }

  async close() {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      logger.info('Closed RabbitMQ connection');
    } catch (error) {
      logger.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }
}

module.exports = new MessageConsumer(); 