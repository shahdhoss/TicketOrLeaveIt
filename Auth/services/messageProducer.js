const amqp = require('amqplib');
const logger = require('../utils/logger');

class MessageProducer {
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

  async publishUserCreation(userData) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const message = {
        type: 'USER_CREATION',
        data: userData,
        timestamp: new Date().toISOString()
      };

      await this.channel.sendToQueue(
        'user_creation',
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
      );

      logger.info('Published user creation message:', userData.email);
    } catch (error) {
      logger.error('Failed to publish user creation message:', error);
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

module.exports = new MessageProducer(); 