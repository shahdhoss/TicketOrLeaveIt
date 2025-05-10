const amqp = require('amqplib');

let channel;

const connect = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

const publishMessage = async (queue, message) => {
  try {
    if (!channel) {
      await connect();
    }
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    console.error('Error publishing message:', error);
    throw error;
  }
};

module.exports = {
  connect,
  publishMessage
}; 